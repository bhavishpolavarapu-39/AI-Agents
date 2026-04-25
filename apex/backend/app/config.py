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
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "https://ai-agents-kvjx.vercel.app"]
    HOST: str = "0.0.0.0"

    # Financial APIs
    FINNHUB_API_KEY: str = os.getenv("FINNHUB_API_KEY", "")
    ALPHA_VANTAGE_API_KEY: str = os.getenv("ALPHA_VANTAGE_API_KEY", "")
    FINNHUB_BASE_URL: str = "https://finnhub.io/api/v1"
    ALPHA_VANTAGE_BASE_URL: str = "https://www.alphavantage.co/query"

    # Cache Settings
    CACHE_ENABLED: bool = True
    CACHE_TTL_QUOTE: int = 300  # 5 minutes
    CACHE_TTL_INTRADAY: int = 300  # 5 minutes
    CACHE_TTL_DAILY: int = 3600  # 1 hour
    CACHE_TTL_INDICATOR: int = 3600  # 1 hour
    CACHE_TTL_NEWS: int = 1800  # 30 minutes
    class Config:
        env_file = ".env"
        case_sensitive = True
settings = Settings()
