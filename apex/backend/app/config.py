from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "APEX"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/apex"
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/apex"
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    MODEL: str = "claude-3-5-sonnet-20241022"
    REDIS_URL: str = "redis://localhost:6379"
    QDRANT_URL: str = "http://localhost:6333"
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    HOST: str = "0.0.0.0"
    class Config:
        env_file = ".env"
        case_sensitive = True
settings = Settings()
