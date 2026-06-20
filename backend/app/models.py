from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    language_background = Column(String, nullable=True)
    proficiency_level = Column(String, nullable=True)
    goals = Column(String, nullable=True)
    profile_picture = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, nullable=False)
    scenario = Column(String, nullable=False)
    messages = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, unique=True, index=True, nullable=False)
    total_xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    last_active_date = Column(String, nullable=True)  # YYYY-MM-DD

class ActivityLog(Base):
    __tablename__ = "activity_log"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True, nullable=False)
    type = Column(String, nullable=False)  # grammar, pronunciation, quiz, interview, translation, daily_challenge
    score = Column(Integer, nullable=False)
    detail = Column(String, nullable=True)
    date = Column(String, nullable=False)  # YYYY-MM-DD
    created_at = Column(DateTime, server_default=func.now())

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    likes = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    
class DictionarySearch(Base):
    __tablename__ = "dictionary_searches"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True, nullable=False)
    word = Column(String, nullable=False)
    date = Column(String, nullable=False)  # YYYY-MM-DD
    created_at = Column(DateTime, server_default=func.now())

class SavedWord(Base):
    __tablename__ = "saved_words"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True, nullable=False)
    word = Column(String, nullable=False)
    meaning = Column(Text, nullable=True)
    example = Column(Text, nullable=True)
    part_of_speech = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())