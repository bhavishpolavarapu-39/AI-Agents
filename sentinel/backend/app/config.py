"""
SENTINEL Configuration
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # API Settings
    PROJECT_NAME: str = "SENTINEL - Infrastructure Intelligence OS"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/sentinel"
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/sentinel"
    
    # LLM
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    MODEL: str = "claude-3-5-sonnet-20241022"
    
    # Infrastructure Integrations
    PROMETHEUS_URL: str = "http://localhost:9090"
    DATADOG_API_KEY: str = os.getenv("DATADOG_API_KEY", "")
    DATADOG_APP_KEY: str = os.getenv("DATADOG_APP_KEY", "")
    NEWRELIC_API_KEY: str = os.getenv("NEWRELIC_API_KEY", "")
    KUBERNETES_API_URL: str = os.getenv("KUBERNETES_API_URL", "https://localhost:6443")
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Vector DB
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_COLLECTION: str = "sentinel_incidents"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ]
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
