from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskSummary
from app.routers.auth import get_current_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("", response_model=TaskSummary)
async def get_tasks(
    completed: Optional[bool] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Task).where(Task.user_id == user_id)
    
    if completed is not None:
        query = query.where(Task.completed == completed)
    if date_from:
        query = query.where(Task.due_date >= date_from)
    if date_to:
        query = query.where(Task.due_date <= date_to)
    
    query = query.order_by(Task.due_date.asc())
    result = await db.execute(query)
    tasks = result.scalars().all()
    
    now = datetime.utcnow()
    overdue = sum(1 for t in tasks if not t.completed and t.due_date < now)
    
    return TaskSummary(
        total=len(tasks),
        completed=sum(1 for t in tasks if t.completed),
        pending=sum(1 for t in tasks if not t.completed),
        overdue=overdue,
        tasks=tasks
    )


@router.post("", response_model=TaskResponse, status_code=201)
async def create_task(
    task_data: TaskCreate,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    task = Task(
        user_id=user_id,
        **task_data.model_dump()
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Task).where(
            and_(Task.id == task_id, Task.user_id == user_id)
        )
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: str,
    update_data: TaskUpdate,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Task).where(
            and_(Task.id == task_id, Task.user_id == user_id)
        )
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(task, field, value)
    
    await db.commit()
    await db.refresh(task)
    return task


@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def toggle_task_complete(
    task_id: str,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Task).where(
            and_(Task.id == task_id, Task.user_id == user_id)
        )
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.completed = not task.completed
    await db.commit()
    await db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=204)
async def delete_task(
    task_id: str,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Task).where(
            and_(Task.id == task_id, Task.user_id == user_id)
        )
    )
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    await db.delete(task)
    await db.commit()
    return None