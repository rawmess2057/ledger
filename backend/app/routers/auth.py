from datetime import timedelta, date
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import Optional

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, UserUpdate, UserWithStats, Token
from app.services.auth_service import (
    create_user,
    authenticate_user,
    get_user_by_id,
    get_user_by_email,
    update_user,
    create_access_token,
    decode_token
)
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    user_id_str = decode_token(token)
    if user_id_str is None:
        raise credentials_exception
    
    user = await get_user_by_id(db, user_id_str)
    if user is None:
        raise credentials_exception
    
    return user_id_str


@router.post("/register", response_model=UserWithStats)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    existing_user = await get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    user = await create_user(db, user_data)
    
    # Fetch the complete user with stats
    result = await db.execute(
        select(User)
        .options(selectinload(User.stats))
        .where(User.id == user.id)
    )
    return result.scalar_one()


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login/json", response_model=Token)
async def login_json(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    user = await authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserWithStats)
async def get_me(
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(User)
        .options(selectinload(User.stats))
        .where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.put("/me", response_model=UserResponse)
async def update_me(
    update_data: UserUpdate,
    user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user = await get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = await update_user(db, user, update_data)
    return updated_user


DEMO_PASSWORD = "demo123"


@router.post("/guest", response_model=Token)
async def guest_login(
    db: AsyncSession = Depends(get_db)
):
    guest_email = "demo@ledger.app"
    
    existing = await get_user_by_email(db, guest_email)
    if existing:
        user = existing
    else:
        weekly_data = [
            {"date": (date.today() - timedelta(days=i)).isoformat(), "minutes": 0, "questions": 0}
            for i in range(6, -1, -1)
        ]
        from app.models.user import User, UserStats, SubjectMastery
        from app.services.auth_service import get_password_hash
        import uuid
        
        user = User(
            id=str(uuid.uuid4()),
            email=guest_email,
            password_hash=get_password_hash(DEMO_PASSWORD),
            name="Demo User",
            level="professional",
            daily_hours=2,
            avatar="DU",
        )
        db.add(user)
        await db.flush()
        
        stats = UserStats(
            user_id=user.id,
            streak=3,
            last_study_date=date.today(),
            total_questions=47,
            correct_answers=35,
            total_study_minutes=420,
            tasks_completed=12,
            tasks_total=15,
            weekly_data=weekly_data
        )
        db.add(stats)
        
        for subject_id in ["accounting", "assurance", "business-finance", "law", "taxation"]:
            mastery = SubjectMastery(
                user_id=user.id,
                subject_id=subject_id,
                mastery_score=65,
                questions_attempted=10,
                questions_correct=7
            )
            db.add(mastery)
        
        await db.commit()
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}