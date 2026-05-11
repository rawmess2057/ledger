from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database - use SQLite for dev, PostgreSQL for production
    DATABASE_URL: str = "sqlite:///./ledger_dev.db"
    DATABASE_URL_ASYNC: str = "sqlite+aiosqlite:///./ledger_dev.db"
    USE_SQLITE: bool = True
    
    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # App
    APP_NAME: str = "Ledger API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()