from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional

from app.database import get_db
from app.models.user import User
from app.models.quiz import Question, QuizSession, QuizAnswer
from app.schemas.quiz import (
    QuestionResponse,
    QuestionListResponse,
    QuizStartRequest,
    QuizStartResponse,
    QuizSubmitRequest,
    QuizResultResponse,
    QuizAnswerResponse,
    QuizHistoryItem
)
from app.schemas.user import SubjectResponse
from app.services.quiz_service import (
    start_quiz_session,
    submit_quiz,
    get_quiz_history,
    get_quiz_with_answers
)
from app.routers.auth import get_current_user

router = APIRouter(prefix="/quiz", tags=["Quiz"])

@router.get("/questions", response_model=List[QuestionListResponse])
async def get_questions(
    subject: Optional[str] = None,
    topic: Optional[str] = None,
    difficulty: Optional[str] = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    query = select(Question)
    
    if subject:
        query = query.where(Question.subject == subject)
    if topic:
        query = query.where(Question.topic == topic)
    if difficulty:
        query = query.where(Question.difficulty == difficulty)
    
    query = query.limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/questions/subjects", response_model=List[SubjectResponse])
async def get_subjects(db: AsyncSession = Depends(get_db)):
    from app.models.user import Subject
    result = await db.execute(select(Subject))
    return result.scalars().all()


@router.get("/questions/{question_id}", response_model=QuestionResponse)
async def get_question(
    question_id: str,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Question).where(Question.id == question_id))
    question = result.scalar_one_or_none()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question


@router.post("/start", response_model=QuizStartResponse)
async def start_quiz(
    request: QuizStartRequest,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    session, questions = await start_quiz_session(db, user_id, request)
    await db.commit()
    
    return QuizStartResponse(
        session_id=session.id,
        questions=[
            QuestionResponse(
                id=q.id,
                type=q.type,
                question=q.question,
                options=q.options,
                correct_answer=q.correct_answer,
                explanation=q.explanation,
                difficulty=q.difficulty,
                topic=q.topic,
                subtopic=q.subtopic,
                subject=q.subject,
                marks=q.marks,
                created_at=q.created_at
            ) for q in questions
        ],
        started_at=session.started_at
    )


@router.post("/{session_id}/submit", response_model=QuizResultResponse)
async def submit_quiz_answers(
    session_id: str,
    request: QuizSubmitRequest,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        session = await submit_quiz(db, user_id, session_id, request.answers, request.time_taken_seconds)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
    result = await db.execute(
        select(QuizAnswer)
        .options(selectinload(QuizAnswer.question))
        .where(QuizAnswer.session_id == session_id)
    )
    answers = result.scalars().all()
    
    return QuizResultResponse(
        session_id=session.id,
        title=session.title,
        total_questions=session.total_questions,
        correct_answers=session.correct_answers,
        score_percentage=session.score_percentage,
        time_taken_seconds=session.total_time_seconds or request.time_taken_seconds,
        completed_at=session.completed_at,
        answers=[
            QuizAnswerResponse(
                question_id=a.question_id,
                user_answer=a.user_answer,
                correct_answer=a.question.correct_answer if a.question else None,
                is_correct=a.is_correct,
                explanation=a.question.explanation if a.question else None
            ) for a in answers
        ]
    )


@router.get("/history", response_model=List[QuizHistoryItem])
async def get_quiz_history_endpoint(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    sessions = await get_quiz_history(db, user_id)
    return [
        QuizHistoryItem(
            session_id=s.id,
            title=s.title,
            subject=s.subject,
            topic=s.topic,
            total_questions=s.total_questions,
            score_percentage=s.score_percentage,
            is_mock=s.is_mock,
            completed_at=s.completed_at,
            started_at=s.started_at
        ) for s in sessions
    ]


@router.get("/{session_id}", response_model=QuizResultResponse)
async def get_quiz_result(
    session_id: str,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    session = await get_quiz_with_answers(db, user_id, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Quiz session not found")
    
    return QuizResultResponse(
        session_id=session.id,
        title=session.title,
        total_questions=session.total_questions,
        correct_answers=session.correct_answers,
        score_percentage=session.score_percentage,
        time_taken_seconds=session.total_time_seconds or 0,
        completed_at=session.completed_at,
        answers=[
            QuizAnswerResponse(
                question_id=a.question_id,
                user_answer=a.user_answer,
                correct_answer=a.question.correct_answer if a.question else None,
                is_correct=a.is_correct,
                explanation=a.question.explanation if a.question else None
            ) for a in session.answers
        ]
    )