from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Post, User, ConnectionRequest, Message
from datetime import datetime

router = APIRouter()

@router.get("/posts")
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).order_by(Post.id.desc()).limit(50).all()
    result = []
    for p in posts:
        user = db.query(User).filter(User.email == p.user_email).first()
        result.append({
            "id": p.id,
            "user_email": p.user_email,
            "full_name": user.full_name if user else "Unknown User",
            "content": p.content,
            "likes": p.likes,
            "created_at": p.created_at.strftime("%Y-%m-%d %H:%M") if p.created_at else ""
        })
    return result

@router.post("/posts")
def create_post(data: dict, db: Session = Depends(get_db)):
    content = data.get("content", "").strip()
    user_email = data.get("user_email", "")

    if not content:
        raise HTTPException(status_code=400, detail="Content cannot be empty")
    if len(content) > 500:
        raise HTTPException(status_code=400, detail="Content too long (max 500 characters)")

    post = Post(user_email=user_email, content=content, likes=0)
    db.add(post)
    db.commit()
    db.refresh(post)
    return {"success": True, "id": post.id}

@router.post("/posts/{post_id}/like")
def like_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.likes += 1
    db.commit()
    return {"likes": post.likes}

@router.delete("/posts/{post_id}")
def delete_post(post_id: int, user_email: str, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.user_email != user_email:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(post)
    db.commit()
    return {"success": True}

@router.get("/study-buddies")
def get_study_buddies(email: str, db: Session = Depends(get_db)):
    # Get current user
    current_user = db.query(User).filter(User.email == email).first()
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get all other users except current user
    other_users = db.query(User).filter(User.email != email).all()

    result = []
    for u in other_users:
        # Calculate compatibility score
        score = 0

        # Different native language = good (can help each other)
        if u.language_background != current_user.language_background:
            score += 2

        # Similar proficiency level = good (can practice together)
        levels = ['Beginner', 'Elementary', 'Intermediate', 'Advanced']
        try:
            current_level_idx = levels.index(current_user.proficiency_level or 'Beginner')
            buddy_level_idx = levels.index(u.proficiency_level or 'Beginner')
            level_diff = abs(current_level_idx - buddy_level_idx)
            if level_diff == 0: score += 3
            elif level_diff == 1: score += 2
            elif level_diff == 2: score += 1
        except ValueError:
            pass

        # Same goals = good
        if u.goals and current_user.goals:
            if u.goals.lower() == current_user.goals.lower():
                score += 1

        result.append({
            "email": u.email,
            "full_name": u.full_name or "Anonymous",
            "language_background": u.language_background or "Unknown",
            "proficiency_level": u.proficiency_level or "Beginner",
            "goals": u.goals or "Improve English",
            "compatibility_score": score,
            "initial": (u.full_name or "U")[0].upper()
        })

    # Sort by compatibility score — best matches first
    result.sort(key=lambda x: x['compatibility_score'], reverse=True)

    return result[:10]  # Return top 10 matches

@router.post("/study-buddies/request")
def send_connection_request(data: dict, db: Session = Depends(get_db)):
    from_email = data.get("from_email")
    to_email = data.get("to_email")

    if not from_email or not to_email:
        raise HTTPException(status_code=400, detail="Missing emails")

    # Check if request already exists
    existing = db.query(ConnectionRequest).filter(
        ConnectionRequest.from_email == from_email,
        ConnectionRequest.to_email == to_email,
        ConnectionRequest.status == "pending"
    ).first()

    if existing:
        return {"success": True, "already_sent": True}

    request = ConnectionRequest(
        from_email=from_email,
        to_email=to_email,
        status="pending"
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    return {"success": True, "id": request.id}

@router.get("/study-buddies/requests")
def get_connection_requests(email: str, db: Session = Depends(get_db)):
    # Requests sent TO this user that are pending
    incoming = db.query(ConnectionRequest).filter(
        ConnectionRequest.to_email == email,
        ConnectionRequest.status == "pending"
    ).all()

    # Requests this user already SENT (to know which buttons to show as sent)
    sent = db.query(ConnectionRequest).filter(
        ConnectionRequest.from_email == email
    ).all()

    incoming_result = []
    for req in incoming:
        sender = db.query(User).filter(User.email == req.from_email).first()
        incoming_result.append({
            "id": req.id,
            "from_email": req.from_email,
            "from_name": sender.full_name if sender else "Unknown",
            "from_language": sender.language_background if sender else "",
            "from_level": sender.proficiency_level if sender else "",
            "from_goals": sender.goals if sender else "",
            "created_at": req.created_at.strftime("%Y-%m-%d") if req.created_at else ""
        })

    sent_result = [
        {"to_email": r.to_email, "status": r.status}
        for r in sent
    ]

    return {
        "incoming": incoming_result,
        "sent": sent_result
    }

@router.patch("/study-buddies/request/{request_id}")
def respond_to_request(request_id: int, data: dict, db: Session = Depends(get_db)):
    action = data.get("action")  # "accept" or "reject"
    email = data.get("email")

    req = db.query(ConnectionRequest).filter(
        ConnectionRequest.id == request_id,
        ConnectionRequest.to_email == email
    ).first()

    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    req.status = "accepted" if action == "accept" else "rejected"
    db.commit()
    return {"success": True, "status": req.status}

@router.get("/study-buddies/connected")
def get_connected_buddies(email: str, db: Session = Depends(get_db)):
    # Get all accepted connections where user is either sender or receiver
    accepted = db.query(ConnectionRequest).filter(
        ((ConnectionRequest.from_email == email) |
         (ConnectionRequest.to_email == email)),
        ConnectionRequest.status == "accepted"
    ).all()

    result = []
    for conn in accepted:
        # Get the OTHER person's email
        buddy_email = conn.to_email if conn.from_email == email else conn.from_email
        buddy = db.query(User).filter(User.email == buddy_email).first()
        if buddy:
            result.append({
                "email": buddy.email,
                "full_name": buddy.full_name or "Unknown",
                "language_background": buddy.language_background or "",
                "proficiency_level": buddy.proficiency_level or "",
                "initial": (buddy.full_name or "U")[0].upper()
            })

    return result

@router.post("/messages/send")
def send_message(data: dict, db: Session = Depends(get_db)):
    from_email = data.get("from_email")
    to_email = data.get("to_email")
    content = data.get("content", "").strip()

    if not from_email or not to_email or not content:
        raise HTTPException(status_code=400, detail="Missing fields")

    msg = Message(
        from_email=from_email,
        to_email=to_email,
        content=content
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return {"success": True, "id": msg.id}

@router.get("/messages/{buddy_email}")
def get_messages(buddy_email: str, email: str, db: Session = Depends(get_db)):
    from app.models import Message
    messages = db.query(Message).filter(
        ((Message.from_email == email) & (Message.to_email == buddy_email)) |
        ((Message.from_email == buddy_email) & (Message.to_email == email))
    ).order_by(Message.id.asc()).all()

    return [
        {
            "id": m.id,
            "from_email": m.from_email,
            "content": m.content,
            "created_at": m.created_at.strftime("%H:%M") if m.created_at else "",
            "is_mine": m.from_email == email
        }
        for m in messages
    ]