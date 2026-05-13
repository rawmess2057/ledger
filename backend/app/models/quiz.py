from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Question details
    type = Column(String(50), nullable=False)  # mcq, numerical, short-answer, journal-entry, case-study
    question = Column(Text, nullable=False)
    options = Column(JSON, nullable=True)  # For MCQ only
    
    # Answer details
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    
    # Metadata
    difficulty = Column(String(20), nullable=False, default="medium")  # easy, medium, hard
    topic = Column(String(255), nullable=False)
    subtopic = Column(String(255), nullable=True)
    subject = Column(String(255), nullable=False)
    marks = Column(Integer, nullable=False, default=2)
    exam = Column(String(100), nullable=True)  # e.g., "june-2019", "dec-2019"
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    answers = relationship("QuizAnswer", back_populates="question")


class QuizSession(Base):
    __tablename__ = "quiz_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Quiz details
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    total_time_seconds = Column(Integer, nullable=True)
    
    # Filter options
    subject = Column(String(255), nullable=True)
    topic = Column(String(255), nullable=True)
    is_mock = Column(Boolean, default=False)
    title = Column(String(255), nullable=True)
    
    # Results (filled after completion)
    total_questions = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    score_percentage = Column(Integer, default=0)
    
    # Relationship
    user = relationship("User", back_populates="quiz_sessions")
    answers = relationship("QuizAnswer", back_populates="session", cascade="all, delete-orphan")


class QuizAnswer(Base):
    __tablename__ = "quiz_answers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String(36), ForeignKey("quiz_sessions.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="SET NULL"), nullable=True)
    
    user_answer = Column(Text, nullable=True)
    is_correct = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    session = relationship("QuizSession", back_populates="answers")
    question = relationship("Question", back_populates="answers")