from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class QuestionBase(BaseModel):
    type: str
    question: str
    options: Optional[List[str]] = None
    correct_answer: str
    explanation: Optional[str] = None
    difficulty: str = "medium"
    topic: str
    subtopic: Optional[str] = None
    subject: str
    marks: int = 2


class QuestionCreate(QuestionBase):
    pass


class QuestionResponse(QuestionBase):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class QuestionListResponse(BaseModel):
    id: str
    type: str
    question: str
    difficulty: str
    topic: str
    subject: str
    marks: int

    class Config:
        from_attributes = True


class QuizStartRequest(BaseModel):
    subject: Optional[str] = None
    topic: Optional[str] = None
    question_count: int = Field(default=5, ge=1, le=50)
    is_mock: bool = False
    title: Optional[str] = None


class QuizStartResponse(BaseModel):
    session_id: str
    questions: List[QuestionResponse]
    started_at: datetime


class QuizAnswerSubmit(BaseModel):
    question_id: str
    user_answer: str


class QuizSubmitRequest(BaseModel):
    answers: List[QuizAnswerSubmit]
    time_taken_seconds: int


class QuizAnswerResponse(BaseModel):
    question_id: str
    user_answer: str
    correct_answer: Optional[str] = None
    is_correct: bool
    explanation: Optional[str] = None

    class Config:
        from_attributes = True


class QuizResultResponse(BaseModel):
    session_id: str
    title: Optional[str] = None
    total_questions: int
    correct_answers: int
    score_percentage: int
    time_taken_seconds: int
    completed_at: datetime
    answers: List[QuizAnswerResponse]

    class Config:
        from_attributes = True


class QuizHistoryItem(BaseModel):
    session_id: str
    title: Optional[str] = None
    subject: Optional[str] = None
    topic: Optional[str] = None
    total_questions: int
    score_percentage: int
    is_mock: bool
    completed_at: Optional[datetime] = None
    started_at: datetime

    class Config:
        from_attributes = True