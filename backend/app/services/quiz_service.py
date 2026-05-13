from datetime import datetime, date, timedelta
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload
import random

from app.models.quiz import Question, QuizSession, QuizAnswer
from app.models.user import UserStats, SubjectMastery
from app.schemas.quiz import QuizStartRequest, QuizAnswerSubmit


async def get_random_questions(
    db: AsyncSession,
    subject: Optional[str] = None,
    topic: Optional[str] = None,
    exam: Optional[str] = None,
    count: int = 5
) -> List[Question]:
    query = select(Question)
    
    if subject:
        query = query.where(Question.subject == subject)
    if topic:
        query = query.where(Question.topic == topic)
    if exam:
        query = query.where(Question.exam == exam)
    
    result = await db.execute(query)
    all_questions = result.scalars().all()
    
    if len(all_questions) <= count:
        return all_questions
    return random.sample(list(all_questions), count)


async def start_quiz_session(
    db: AsyncSession,
    user_id: str,
    request: QuizStartRequest
) -> tuple[QuizSession, List[Question]]:
    questions = await get_random_questions(
        db,
        subject=request.subject,
        topic=request.topic,
        exam=request.exam,
        count=request.question_count
    )
    
    session = QuizSession(
        user_id=user_id,
        subject=request.subject,
        topic=request.topic,
        is_mock=request.is_mock,
        title=request.title,
        total_questions=len(questions)
    )
    db.add(session)
    await db.flush()
    
    return session, questions


async def submit_quiz(
    db: AsyncSession,
    user_id: str,
    session_id: str,
    answers: List[QuizAnswerSubmit],
    time_taken_seconds: int
) -> QuizSession:
    result = await db.execute(
        select(QuizSession).where(
            and_(QuizSession.id == session_id, QuizSession.user_id == user_id)
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise ValueError("Quiz session not found")
    
    question_ids = [a.question_id for a in answers]
    result = await db.execute(select(Question).where(Question.id.in_(question_ids)))
    questions_map = {q.id: q for q in result.scalars().all()}
    
    correct_count = 0
    for answer_data in answers:
        question = questions_map.get(answer_data.question_id)
        is_correct = False
        
        if question:
            if question.type == "mcq":
                is_correct = answer_data.user_answer.strip().lower() == str(question.correct_answer).strip().lower()
            else:
                is_correct = answer_data.user_answer.strip() == str(question.correct_answer).strip()
            
            if is_correct:
                correct_count += 1
        
        answer = QuizAnswer(
            session_id=session_id,
            question_id=answer_data.question_id,
            user_answer=answer_data.user_answer,
            is_correct=is_correct
        )
        db.add(answer)
    
    session.completed_at = datetime.utcnow()
    session.total_time_seconds = time_taken_seconds
    session.correct_answers = correct_count
    session.score_percentage = int((correct_count / len(answers)) * 100) if answers else 0
    
    await update_user_stats_after_quiz(
        db,
        user_id,
        len(answers),
        correct_count,
        time_taken_seconds // 60
    )
    
    if session.subject:
        await update_subject_mastery(
            db,
            user_id,
            session.subject,
            len(answers),
            correct_count
        )
    
    await db.commit()
    await db.refresh(session)
    return session


async def update_user_stats_after_quiz(
    db: AsyncSession,
    user_id: str,
    questions_count: int,
    correct_count: int,
    minutes: int
):
    result = await db.execute(select(UserStats).where(UserStats.user_id == user_id))
    stats = result.scalar_one_or_none()
    
    if stats:
        today = date.today()
        
        if stats.last_study_date:
            if stats.last_study_date == today:
                pass
            elif stats.last_study_date == today - timedelta(days=1):
                stats.streak += 1
            else:
                stats.streak = 1
        else:
            stats.streak = 1
        
        stats.last_study_date = today
        stats.total_questions += questions_count
        stats.correct_answers += correct_count
        stats.total_study_minutes += minutes
        
        today_str = today.isoformat()
        weekly_data = stats.weekly_data or []
        updated = False
        for day in weekly_data:
            if day.get("date") == today_str:
                day["minutes"] = day.get("minutes", 0) + minutes
                day["questions"] = day.get("questions", 0) + questions_count
                updated = True
                break
        
        if not updated:
            weekly_data.append({
                "date": today_str,
                "minutes": minutes,
                "questions": questions_count
            })
            weekly_data = weekly_data[-7:]
        
        stats.weekly_data = weekly_data


async def update_subject_mastery(
    db: AsyncSession,
    user_id: str,
    subject_id: str,
    questions_attempted: int,
    questions_correct: int
):
    result = await db.execute(
        select(SubjectMastery).where(
            and_(
                SubjectMastery.user_id == user_id,
                SubjectMastery.subject_id == subject_id
            )
        )
    )
    mastery = result.scalar_one_or_none()
    
    if mastery:
        mastery.questions_attempted += questions_attempted
        mastery.questions_correct += questions_correct
        if mastery.questions_attempted > 0:
            mastery.mastery_score = int((mastery.questions_correct / mastery.questions_attempted) * 100)


async def get_quiz_history(
    db: AsyncSession,
    user_id: str,
    limit: int = 20
) -> List[QuizSession]:
    result = await db.execute(
        select(QuizSession)
        .where(QuizSession.user_id == user_id)
        .order_by(QuizSession.started_at.desc())
        .limit(limit)
    )
    return result.scalars().all()


async def get_quiz_with_answers(
    db: AsyncSession,
    user_id: str,
    session_id: str
) -> Optional[QuizSession]:
    result = await db.execute(
        select(QuizSession)
        .options(selectinload(QuizSession.answers).selectinload(QuizAnswer.question))
        .where(
            and_(
                QuizSession.id == session_id,
                QuizSession.user_id == user_id
            )
        )
    )
    return result.scalar_one_or_none()