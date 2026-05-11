from datetime import datetime, timedelta, date
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.config import settings
from app.models.user import User, UserStats, Subject, SubjectMastery
from app.schemas.user import UserCreate, UserUpdate


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        return user_id
    except JWTError:
        return None


async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: str) -> Optional[User]:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def create_user(db: AsyncSession, user_data: UserCreate) -> User:
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise ValueError("User already exists")
    
    weekly_data = [
        {"date": (date.today() - timedelta(days=i)).isoformat(), "minutes": 0, "questions": 0}
        for i in range(6, -1, -1)
    ]
    
    user = User(
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        name=user_data.name,
        phone=user_data.phone,
        level=user_data.level,
        exam_date=user_data.exam_date,
        daily_hours=user_data.daily_hours,
        avatar="".join([n[0] for n in user_data.name.split()[:2]]).upper()
    )
    db.add(user)
    await db.flush()
    
    stats = UserStats(
        user_id=user.id,
        streak=1,
        last_study_date=date.today(),
        weekly_data=weekly_data
    )
    db.add(stats)
    
    subjects = [
        ("accounting", "Accounting", "from-teal-500 to-emerald-500"),
        ("assurance", "Assurance & IS", "from-blue-500 to-cyan-500"),
        ("business-finance", "Business & Finance", "from-violet-500 to-purple-500"),
        ("law", "Business Law", "from-amber-500 to-orange-500"),
        ("taxation", "Taxation", "from-rose-500 to-pink-500"),
    ]
    for subject_id, name, color in subjects:
        result = await db.execute(select(Subject).where(Subject.id == subject_id))
        if not result.scalar_one_or_none():
            subject = Subject(id=subject_id, name=name, color=color)
            db.add(subject)
        
        mastery = SubjectMastery(
            user_id=user.id,
            subject_id=subject_id,
            mastery_score=0,
            questions_attempted=0,
            questions_correct=0
        )
        db.add(mastery)
    
    await db.commit()
    
    # Return a response model instead of ORM object to avoid lazy loading issues
    return user


async def update_user(db: AsyncSession, user: User, update_data: UserUpdate) -> User:
    update_dict = update_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(user, field, value)
    await db.commit()
    await db.refresh(user)
    return user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
    user = await get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user