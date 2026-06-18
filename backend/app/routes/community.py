from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Post, User

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