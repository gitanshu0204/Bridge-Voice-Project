from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import UserProgress, ActivityLog
from app.schemas import ActivityLogCreate, AddXPRequest
from datetime import datetime, timedelta
from app.models import User
from app.models import DictionarySearch
from app.models import SavedWord

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

@router.post("/dictionary/log")
def log_dictionary_search(data: dict, db: Session = Depends(get_db)):
    user_email = data.get("user_email")
    word = data.get("word", "").strip().lower()

    if not user_email or not word:
        raise HTTPException(status_code=400, detail="Missing user_email or word")

    entry = DictionarySearch(
        user_email=user_email,
        word=word,
        date=datetime.now().strftime("%Y-%m-%d")
    )
    db.add(entry)
    db.commit()
    return {"success": True}

@router.get("/dictionary/count")
def get_dictionary_word_count(email: str, db: Session = Depends(get_db)):
    distinct_words = db.query(DictionarySearch.word).filter(
        DictionarySearch.user_email == email
    ).distinct().count()
    return {"unique_words": distinct_words}

@router.get("/saved-words")
def get_saved_words(email: str, db: Session = Depends(get_db)):
    words = db.query(SavedWord).filter(
        SavedWord.user_email == email
    ).order_by(SavedWord.id.desc()).all()

    return [
        {
            "id": w.id,
            "word": w.word,
            "meaning": w.meaning,
            "example": w.example,
            "partOfSpeech": w.part_of_speech
        }
        for w in words
    ]

@router.post("/saved-words")
def save_word(data: dict, db: Session = Depends(get_db)):
    user_email = data.get("user_email")
    word = data.get("word", "").strip()

    if not user_email or not word:
        raise HTTPException(status_code=400, detail="Missing user_email or word")

    existing = db.query(SavedWord).filter(
        SavedWord.user_email == user_email,
        SavedWord.word.ilike(word)
    ).first()
    if existing:
        return {"success": True, "already_saved": True}

    entry = SavedWord(
        user_email=user_email,
        word=word,
        meaning=data.get("meaning", ""),
        example=data.get("example", ""),
        part_of_speech=data.get("partOfSpeech", "")
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {"success": True, "id": entry.id}

@router.delete("/saved-words/{word_id}")
def delete_saved_word(word_id: int, email: str, db: Session = Depends(get_db)):
    entry = db.query(SavedWord).filter(
        SavedWord.id == word_id,
        SavedWord.user_email == email
    ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Word not found")
    db.delete(entry)
    db.commit()
    return {"success": True}

@router.get("/weak-areas")
def get_weak_areas(email: str, db: Session = Depends(get_db)):
    entries = db.query(ActivityLog).filter(ActivityLog.user_email == email).all()

    if len(entries) < 3:
        return {
            "has_enough_data": False,
            "weakest_skill": None,
            "weakest_avg": None,
            "overall_avg": None
        }

    skill_scores = {}
    for e in entries:
        skill_scores.setdefault(e.type, []).append(e.score)

    skill_averages = {
        skill: round(sum(scores) / len(scores), 1)
        for skill, scores in skill_scores.items()
        if len(scores) >= 2  # only consider skills with at least 2 attempts
    }

    overall_avg = round(sum(e.score for e in entries) / len(entries), 1)

    if not skill_averages:
        return {
            "has_enough_data": False,
            "weakest_skill": None,
            "weakest_avg": None,
            "overall_avg": overall_avg
        }

    weakest_skill = min(skill_averages, key=skill_averages.get)

    skill_labels = {
        "grammar": "Grammar",
        "pronunciation": "Pronunciation",
        "quiz": "Vocabulary",
        "interview": "Interview Skills",
        "translation": "Translation",
        "daily_challenge": "Daily Practice"
    }

    return {
        "has_enough_data": True,
        "weakest_skill": skill_labels.get(weakest_skill, weakest_skill),
        "weakest_avg": skill_averages[weakest_skill],
        "overall_avg": overall_avg
    }