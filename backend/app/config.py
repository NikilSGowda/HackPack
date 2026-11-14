"""ScamShield Backend Configuration Settings"""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "ScamShield API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Intelligent Digital Scam, Phishing URL & Fraudulent Message Detection API"
    API_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # Input Limits
    MAX_URL_LENGTH: int = 2048
    MAX_MESSAGE_LENGTH: int = 10000

    # CORS Origins (includes Vite local dev port 5173)
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    # Optional Auth / Secret Key
    SECRET_KEY: str = "scamshield-defensive-secret-key-development"
    AUTH_ENABLED: bool = False

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
