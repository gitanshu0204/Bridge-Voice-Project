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
    created_at = Column(DateTime, server_default=func.now())

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, nullable=False)
    scenario = Column(String, nullable=False)
    messages = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())