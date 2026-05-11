from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List

from app.database import get_db
from app.models.user import User, UserStats, Subject, SubjectMastery
from app.schemas.user import UserStatsResponse, SubjectMasteryResponse, WeeklyDataPoint
from app.routers.auth import get_current_user

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.get("/overview", response_model=UserStatsResponse)
async def get_progress_overview(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(UserStats).where(UserStats.user_id == user_id)
    )
    stats = result.scalar_one_or_none()
    
    if not stats:
        raise HTTPException(status_code=404, detail="User stats not found")
    
    accuracy_rate = 0
    if stats.total_questions > 0:
        accuracy_rate = int((stats.correct_answers / stats.total_questions) * 100)
    
    return UserStatsResponse(
        streak=stats.streak,
        last_study_date=stats.last_study_date,
        total_questions=stats.total_questions,
        correct_answers=stats.correct_answers,
        total_study_minutes=stats.total_study_minutes,
        tasks_completed=stats.tasks_completed,
        tasks_total=stats.tasks_total,
        weekly_data=[WeeklyDataPoint(**d) for d in (stats.weekly_data or [])],
        accuracy_rate=accuracy_rate
    )


@router.get("/mastery", response_model=List[SubjectMasteryResponse])
async def get_subject_mastery(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(SubjectMastery)
        .options(selectinload(SubjectMastery.subject))
        .where(SubjectMastery.user_id == user_id)
    )
    mastery_records = result.scalars().all()
    
    return [
        SubjectMasteryResponse(
            subject_id=m.subject_id,
            subject_name=m.subject.name if m.subject else m.subject_id,
            mastery_score=m.mastery_score,
            questions_attempted=m.questions_attempted,
            questions_correct=m.questions_correct,
            color=m.subject.color if m.subject else "from-teal-500 to-emerald-500"
        ) for m in mastery_records
    ]


@router.get("/weekly")
async def get_weekly_data(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(UserStats).where(UserStats.user_id == user_id)
    )
    stats = result.scalar_one_or_none()
    
    if not stats:
        return {"weekly_data": []}
    
    weekly_data = stats.weekly_data or []
    total_minutes = sum(d.get("minutes", 0) for d in weekly_data)
    total_questions = sum(d.get("questions", 0) for d in weekly_data)
    
    return {
        "weekly_data": [WeeklyDataPoint(**d) for d in weekly_data],
        "total_minutes": total_minutes,
        "total_questions": total_questions
    }