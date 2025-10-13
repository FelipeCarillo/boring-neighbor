from typing import Annotated, Optional

from dotenv import load_dotenv
from pydantic import Field
from pydantic_settings import BaseSettings

from helpers.enums import STAGE

load_dotenv()


class Env(BaseSettings):
    # Environment
    PROJECT_NAME: str
    STAGE: Annotated[STAGE, Field(default=STAGE.LOCAL)]
    API_VERSION: str

    # S3
    BUCKET_NAME: str

    # Database Connection
    DATABASE_URL: str
    DATABASE_SCHEMA: str

    # JWT Configuration
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # OAuth2 Redirect URIs
    UI_DOMAIN: Optional[str] = None
    API_DOMAIN: str

    # Celery Configuration
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"

    # 3D Processing Configuration
    PROCESSING_BATCH_SIZE: int = 10000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @property
    def LOGIN_URI(self) -> str:
        return f"{self.API_DOMAIN}/api/{self.API_VERSION}/auth/login"

    @property
    def TOKEN_URI(self) -> str:
        return f"{self.API_DOMAIN}/api/{self.API_VERSION}/auth/token"

    def is_local(self) -> bool:
        return self.STAGE == STAGE.LOCAL
