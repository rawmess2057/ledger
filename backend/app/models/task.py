from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Task details
    title = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=False)
    topic = Column(String(255), nullable=True)
    
    # Task type and priority
    task_type = Column(String(50), nullable=False, default="practice")  # quiz, revision, mock, practice
    priority = Column(String(20), nullable=False, default="medium")  # high, medium, low
    duration = Column(Integer, nullable=False, default=45)  # minutes
    
    # Status
    completed = Column(Boolean, default=False)
    due_date = Column(DateTime, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = relationship("User", back_populates="tasks")