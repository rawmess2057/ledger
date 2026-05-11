from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime, date


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    phone: Optional[str] = None
    password: str = Field(..., min_length=6)
    level: str = Field(default="foundation")
    exam_date: Optional[date] = None
    daily_hours: int = Field(default=3, ge=1, le=24)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    level: Optional[str] = None
    exam_date: Optional[date] = None
    daily_hours: Optional[int] = Field(None, ge=1, le=24)


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    phone: Optional[str] = None
    level: str
    exam_date: Optional[date] = None
    daily_hours: int
    avatar: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserWithStats(UserResponse):
    stats: Optional["UserStatsResponse"] = None

    class Config:
        from_attributes = True


class WeeklyDataPoint(BaseModel):
    date: str
    minutes: int = 0
    questions: int = 0


class UserStatsResponse(BaseModel):
    streak: int = 1
    last_study_date: Optional[date] = None
    total_questions: int = 0
    correct_answers: int = 0
    total_study_minutes: int = 0
    tasks_completed: int = 0
    tasks_total: int = 0
    weekly_data: List[WeeklyDataPoint] = []
    accuracy_rate: int = 0

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[str] = None


class SubjectResponse(BaseModel):
    id: str
    name: str
    papers: int = 1
    color: str = "from-teal-500 to-emerald-500"
    icon: str = "book"

    class Config:
        from_attributes = True


class SubjectMasteryResponse(BaseModel):
    subject_id: str
    subject_name: str
    mastery_score: int = 0
    questions_attempted: int = 0
    questions_correct: int = 0
    color: str = "from-teal-500 to-emerald-500"

    class Config:
        from_attributes = True


UserWithStats.model_rebuild()