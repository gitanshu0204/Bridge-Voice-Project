from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserRegister, UserLogin, UserResponse, Token
from app.auth import hash_password, verify_password, create_access_token
from app.schemas import UserUpdate

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(user: UserRegister, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hash_password(user.password),
        language_background=user.language_background,
        proficiency_level=user.proficiency_level,
        goals=user.goals
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    # Find user by email
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # Check password
    if not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # Create token
    token = create_access_token(data={"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/profile", response_model=UserResponse)
def get_profile(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/profile", response_model=UserResponse)
def update_profile(email: str, data: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.language_background is not None:
        user.language_background = data.language_background
    if data.proficiency_level is not None:
        user.proficiency_level = data.proficiency_level
    if data.goals is not None:
        user.goals = data.goals

    db.commit()
    db.refresh(user)
    return user