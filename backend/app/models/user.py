from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, Text, Date, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    level = Column(String(50), nullable=False, default="foundation")
    exam_date = Column(Date, nullable=True)
    daily_hours = Column(Integer, default=3)
    avatar = Column(String(10), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    stats = relationship("UserStats", back_populates="user", uselist=False, cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")
    quiz_sessions = relationship("QuizSession", back_populates="user", cascade="all, delete-orphan")
    subject_mastery = relationship("SubjectMastery", back_populates="user", cascade="all, delete-orphan")


class UserStats(Base):
    __tablename__ = "user_stats"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    streak = Column(Integer, default=1)
    last_study_date = Column(Date, nullable=True)
    total_questions = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    total_study_minutes = Column(Integer, default=0)
    tasks_completed = Column(Integer, default=0)
    tasks_total = Column(Integer, default=0)
    weekly_data = Column(JSON, default=[])  # [{date, minutes, questions}]
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="stats")


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(String(100), primary_key=True)
    name = Column(String(255), nullable=False)
    papers = Column(Integer, default=1)
    color = Column(String(50), default="from-teal-500 to-emerald-500")
    icon = Column(String(50), default="book")
    
    # Relationship
    mastery_records = relationship("SubjectMastery", back_populates="subject")


class SubjectMastery(Base):
    __tablename__ = "subject_mastery"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(String(100), ForeignKey("subjects.id"), nullable=False)
    
    mastery_score = Column(Integer, default=0)
    questions_attempted = Column(Integer, default=0)
    questions_correct = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="subject_mastery")
    subject = relationship("Subject", back_populates="mastery_records")