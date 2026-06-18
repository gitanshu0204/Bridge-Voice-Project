from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import UserProgress, ActivityLog
from app.schemas import ActivityLogCreate, AddXPRequest
from datetime import datetime, timedelta
from app.models import User

router = APIRouter()

def get_or_create_progress(db: Session, email: str):
    progress = db.query(UserProgress).filter(UserProgress.user_email == email).first()
    if not progress:
        progress = UserProgress(user_email=email, total_xp=0, streak=0, last_active_date=None)
        db.add(progress)
        db.commit()
        db.refresh(progress)
    return progress

@router.get("/progress")
def get_progress(email: str, db: Session = Depends(get_db)):
    progress = get_or_create_progress(db, email)
    return {
        "total_xp": progress.total_xp,
        "streak": progress.streak,
        "last_active_date": progress.last_active_date
    }

@router.post("/progress/add-xp")
def add_xp(data: AddXPRequest, db: Session = Depends(get_db)):
    progress = get_or_create_progress(db, data.user_email)

    today = datetime.now().strftime("%Y-%m-%d")
    yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

    amount = data.amount

    if progress.last_active_date != today:
        if progress.last_active_date == yesterday:
            progress.streak += 1
        else:
            progress.streak = 1
        progress.last_active_date = today

        if progress.streak >= 3:
            amount += 10

    progress.total_xp += amount
    db.commit()
    db.refresh(progress)

    return {
        "total_xp": progress.total_xp,
        "streak": progress.streak,
        "last_active_date": progress.last_active_date,
        "xp_added": amount
    }

@router.post("/activity/log")
def log_activity(data: ActivityLogCreate, db: Session = Depends(get_db)):
    entry = ActivityLog(
        user_email=data.user_email,
        type=data.type,
        score=data.score,
        detail=data.detail,
        date=datetime.now().strftime("%Y-%m-%d")
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {"success": True}

@router.get("/activity/log")
def get_activity_log(email: str, limit: int = 100, db: Session = Depends(get_db)):
    entries = db.query(ActivityLog).filter(
        ActivityLog.user_email == email
    ).order_by(ActivityLog.id.desc()).limit(limit).all()

    return [
        {
            "type": e.type,
            "score": e.score,
            "detail": e.detail,
            "date": e.date
        }
        for e in entries
    ]

@router.get("/leaderboard")
def get_leaderboard(email: str = None, db: Session = Depends(get_db)):
    results = db.query(UserProgress, User).join(
        User, UserProgress.user_email == User.email
    ).order_by(UserProgress.total_xp.desc()).limit(20).all()

    leaderboard = []
    for i, (progress, user) in enumerate(results):
        leaderboard.append({
            "rank": i + 1,
            "name": user.full_name,
            "email": user.email,
            "xp": progress.total_xp,
            "streak": progress.streak,
            "is_you": user.email == email
        })

    return leaderboard