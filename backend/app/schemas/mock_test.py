from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class MockTestItem(BaseModel):
    id: str
    title: str
    level: str
    subject: Optional[str] = None
    duration_minutes: int
    total_marks: int
    question_count: int


class MockTestStartRequest(BaseModel):
    mock_test_id: str


class MockTestStartResponse(BaseModel):
    session_id: str
    mock_test_id: str
    title: str
    subject: Optional[str] = None
    duration_minutes: int
    total_marks: int
    questions: List[dict]
    started_at: datetime


class MockTestAnswerSubmit(BaseModel):
    question_id: str
    user_answer: str
    time_spent_seconds: int = 0


class MockTestSubmitRequest(BaseModel):
    answers: List[MockTestAnswerSubmit]
    time_taken_seconds: int


class MockTestQuestionResult(BaseModel):
    question_id: str
    question: str
    type: str
    difficulty: str
    topic: str
    marks: int
    user_answer: str
    correct_answer: str
    explanation: Optional[str] = None
    is_correct: bool


class MockTestResultResponse(BaseModel):
    session_id: str
    mock_test_id: str
    title: str
    subject: Optional[str] = None
    total_questions: int
    total_marks: int
    obtained_marks: int
    score_percentage: int
    correct_answers: int
    time_taken_seconds: int
    completed_at: datetime
    questions: List[MockTestQuestionResult]
