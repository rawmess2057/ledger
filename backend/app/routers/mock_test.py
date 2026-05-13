import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from typing import List

from app.database import get_db
from app.models.quiz import Question, QuizSession, QuizAnswer
from app.schemas.mock_test import (
    MockTestItem,
    MockTestStartRequest,
    MockTestStartResponse,
    MockTestSubmitRequest,
    MockTestResultResponse,
    MockTestQuestionResult,
)
from app.routers.auth import get_current_user

router = APIRouter(prefix="/mock-tests", tags=["Mock Tests"])


@router.get("", response_model=List[MockTestItem])
async def list_mock_tests(
    level: str = "CAP-II",
    subject: str = None,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        text("SELECT id, title, level, subject, duration_minutes, total_marks, question_ids FROM mock_tests WHERE level = :level"),
        {"level": level}
    )
    rows = result.fetchall()
    tests = []
    for row in rows:
        qids = json.loads(row[6]) if row[6] else []
        if subject and row[3] != subject:
            continue
        tests.append(MockTestItem(
            id=row[0],
            title=row[1],
            level=row[2],
            subject=row[3],
            duration_minutes=row[4],
            total_marks=row[5],
            question_count=len(qids)
        ))
    return tests


@router.get("/{test_id}", response_model=MockTestItem)
async def get_mock_test(test_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        text("SELECT id, title, level, subject, duration_minutes, total_marks, question_ids FROM mock_tests WHERE id = :id"),
        {"id": test_id}
    )
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Mock test not found")
    qids = json.loads(row[6]) if row[6] else []
    return MockTestItem(
        id=row[0],
        title=row[1],
        level=row[2],
        subject=row[3],
        duration_minutes=row[4],
        total_marks=row[5],
        question_count=len(qids)
    )


@router.post("/start", response_model=MockTestStartResponse)
async def start_mock_test(
    request: MockTestStartRequest,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        text("SELECT id, title, level, subject, duration_minutes, total_marks, question_ids FROM mock_tests WHERE id = :id"),
        {"id": request.mock_test_id}
    )
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Mock test not found")

    qids = json.loads(row[6]) if row[6] else []
    if not qids:
        raise HTTPException(status_code=400, detail="Mock test has no questions")

    # Get questions
    result = await db.execute(
        select(Question).where(Question.id.in_(qids))
    )
    questions = result.scalars().all()

    # Sort by marks descending to match original order
    q_map = {q.id: q for q in questions}
    sorted_qs = [q_map[qid] for qid in qids if qid in q_map]

    # Create quiz session with is_mock=True
    session = QuizSession(
        user_id=user_id,
        subject=row[3],
        is_mock=True,
        title=row[1],
        total_questions=len(sorted_qs)
    )
    db.add(session)
    await db.flush()

    return MockTestStartResponse(
        session_id=session.id,
        mock_test_id=row[0],
        title=row[1],
        subject=row[3],
        duration_minutes=row[4],
        total_marks=row[5],
        questions=[
            {
                "id": q.id,
                "type": q.type,
                "question": q.question,
                "options": q.options,
                "difficulty": q.difficulty,
                "topic": q.topic,
                "subtopic": q.subtopic,
                "subject": q.subject,
                "marks": q.marks,
            } for q in sorted_qs
        ],
        started_at=session.started_at
    )


@router.post("/{session_id}/submit", response_model=MockTestResultResponse)
async def submit_mock_test(
    session_id: str,
    request: MockTestSubmitRequest,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(QuizSession).where(
            QuizSession.id == session_id,
            QuizSession.user_id == user_id,
            QuizSession.is_mock == True
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Mock test session not found")

    question_ids = [a.question_id for a in request.answers]
    result = await db.execute(select(Question).where(Question.id.in_(question_ids)))
    questions_map = {q.id: q for q in result.scalars().all()}

    correct_count = 0
    obtained_marks = 0
    total_marks = 0

    for answer_data in request.answers:
        question = questions_map.get(answer_data.question_id)
        is_correct = False

        if question:
            total_marks += question.marks
            user_ans = answer_data.user_answer.strip().lower() if answer_data.user_answer else ""
            correct_ans = question.correct_answer.strip().lower() if question.correct_answer else ""

            # Simple matching - check if user answer contains key terms from correct answer
            # For numerical, check exact match
            # For descriptive, check if any key terms match
            if question.type == "numerical":
                try:
                    is_correct = abs(float(user_ans.replace(",", "")) - float(correct_ans.replace(",", ""))) < 0.01
                except:
                    is_correct = user_ans == correct_ans
            elif question.type == "mcq":
                is_correct = user_ans == correct_ans
            else:
                # For descriptive answers, check keyword overlap
                correct_keywords = set(correct_ans.split())
                user_keywords = set(user_ans.split())
                if len(correct_keywords) > 0:
                    overlap = len(correct_keywords & user_keywords)
                    is_correct = overlap >= max(2, len(correct_keywords) * 0.3)

            if is_correct:
                correct_count += 1
                obtained_marks += question.marks

        answer = QuizAnswer(
            session_id=session_id,
            question_id=answer_data.question_id,
            user_answer=answer_data.user_answer,
            is_correct=is_correct
        )
        db.add(answer)

    session.completed_at = datetime.utcnow()
    session.total_time_seconds = request.time_taken_seconds
    session.correct_answers = correct_count
    session.score_percentage = int((obtained_marks / total_marks * 100)) if total_marks > 0 else 0

    await db.commit()
    await db.refresh(session)

    # Build results
    question_list = []
    for answer_data in request.answers:
        q = questions_map.get(answer_data.question_id)
        if q:
            is_correct = False
            user_ans = answer_data.user_answer.strip().lower() if answer_data.user_answer else ""
            correct_ans = q.correct_answer.strip().lower() if q.correct_answer else ""
            if q.type == "numerical":
                try:
                    is_correct = abs(float(user_ans.replace(",", "")) - float(correct_ans.replace(",", ""))) < 0.01
                except:
                    is_correct = user_ans == correct_ans
            elif q.type == "mcq":
                is_correct = user_ans == correct_ans
            else:
                correct_keywords = set(correct_ans.split())
                user_keywords = set(user_ans.split())
                if len(correct_keywords) > 0:
                    overlap = len(correct_keywords & user_keywords)
                    is_correct = overlap >= max(2, len(correct_keywords) * 0.3)

            question_list.append(MockTestQuestionResult(
                question_id=q.id,
                question=q.question,
                type=q.type,
                difficulty=q.difficulty,
                topic=q.topic,
                marks=q.marks,
                user_answer=answer_data.user_answer or "",
                correct_answer=q.correct_answer or "",
                explanation=q.explanation,
                is_correct=is_correct
            ))

    return MockTestResultResponse(
        session_id=session.id,
        mock_test_id="",
        title=session.title or "",
        subject=session.subject,
        total_questions=session.total_questions,
        total_marks=total_marks,
        obtained_marks=obtained_marks,
        score_percentage=session.score_percentage,
        correct_answers=session.correct_answers,
        time_taken_seconds=request.time_taken_seconds,
        completed_at=session.completed_at,
        questions=question_list
    )


@router.get("/{session_id}/result", response_model=MockTestResultResponse)
async def get_mock_test_result(
    session_id: str,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(QuizSession).where(
            QuizSession.id == session_id,
            QuizSession.user_id == user_id,
            QuizSession.is_mock == True
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Mock test session not found")

    # Get answers
    result = await db.execute(
        select(QuizAnswer)
        .where(QuizAnswer.session_id == session_id)
    )
    db_answers = result.scalars().all()

    if not db_answers:
        raise HTTPException(status_code=400, detail="Mock test not yet submitted")

    # Get questions
    qids = [a.question_id for a in db_answers]
    result = await db.execute(select(Question).where(Question.id.in_(qids)))
    questions_map = {q.id: q for q in result.scalars().all()}

    # Get mock test info
    result = await db.execute(
        text("SELECT id, total_marks FROM mock_tests WHERE id LIKE :pattern"),
        {"pattern": f"%{session.subject or ''}%"}
    )
    mt_row = result.fetchone()

    question_list = []
    total_marks = 0
    obtained_marks = 0
    correct_count = 0

    for a in db_answers:
        q = questions_map.get(a.question_id)
        if q:
            total_marks += q.marks
            if a.is_correct:
                correct_count += 1
                obtained_marks += q.marks
            question_list.append(MockTestQuestionResult(
                question_id=q.id,
                question=q.question,
                type=q.type,
                difficulty=q.difficulty,
                topic=q.topic,
                marks=q.marks,
                user_answer=a.user_answer or "",
                correct_answer=q.correct_answer or "",
                explanation=q.explanation,
                is_correct=a.is_correct
            ))

    return MockTestResultResponse(
        session_id=session.id,
        mock_test_id=mt_row[0] if mt_row else "",
        title=session.title or "",
        subject=session.subject,
        total_questions=session.total_questions,
        total_marks=total_marks,
        obtained_marks=obtained_marks,
        score_percentage=session.score_percentage,
        correct_answers=correct_count,
        time_taken_seconds=session.total_time_seconds or 0,
        completed_at=session.completed_at,
        questions=question_list
    )
