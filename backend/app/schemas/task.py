from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    subject: str
    topic: Optional[str] = None
    task_type: str = "practice"
    priority: str = "medium"
    duration: int = Field(default=45, ge=15, le=180)
    due_date: datetime


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    subject: Optional[str] = None
    topic: Optional[str] = None
    task_type: Optional[str] = None
    priority: Optional[str] = None
    duration: Optional[int] = Field(None, ge=15, le=180)
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None


class TaskResponse(BaseModel):
    id: str
    title: str
    subject: str
    topic: Optional[str] = None
    task_type: str
    priority: str
    duration: int
    due_date: datetime
    completed: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TaskSummary(BaseModel):
    total: int
    completed: int
    pending: int
    overdue: int
    tasks: list[TaskResponse]