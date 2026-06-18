from pydantic import BaseModel
from typing import Optional

class UserUpdate(BaseModel):
    language_background: Optional[str] = None
    proficiency_level: Optional[str] = None
    goals: Optional[str] = None
    profile_picture: Optional[str] = None

class UserRegister(BaseModel):
    full_name: str
    email: str
    password: str
    language_background: Optional[str] = None
    proficiency_level: Optional[str] = None
    goals: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    language_background: Optional[str] = None
    proficiency_level: Optional[str] = None
    goals: Optional[str] = None
    profile_picture: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class ActivityLogCreate(BaseModel):
    user_email: str
    type: str
    score: int
    detail: str = ""

class ActivityLogResponse(BaseModel):
    type: str
    score: int
    detail: str
    date: str

    class Config:
        from_attributes = True

class ProgressResponse(BaseModel):
    total_xp: int
    streak: int
    last_active_date: str | None = None

    class Config:
        from_attributes = True

class AddXPRequest(BaseModel):
    user_email: str
    amount: int
    reason: str = ""

class PostCreate(BaseModel):
    user_email: str
    content: str

class PostResponse(BaseModel):
    id: int
    user_email: str
    content: str
    likes: int
    created_at: str

    class Config:
        from_attributes = True

class PasswordChange(BaseModel):
    email: str
    current_password: str
    new_password: str