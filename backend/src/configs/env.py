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

    # Database Connection
    DATABASE_URL: str

    # Azure Auth
    AZURE_TENANT_ID: str
    AZURE_CLIENT_ID: str
    AZURE_CLIENT_SECRET: str

    # OAuth2 Redirect URIs
    UI_DOMAIN: Optional[str] = None
    API_DOMAIN: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @property
    def REDIRECT_URI(self) -> str:
        return f"{self.API_DOMAIN}/api/{self.API_VERSION}/auth/callback"

    @property
    def LOGIN_URI(self) -> str:
        return f"{self.API_DOMAIN}/api/{self.API_VERSION}/auth/login"

    @property
    def TOKEN_URI(self) -> str:
        return f"{self.API_DOMAIN}/api/{self.API_VERSION}/auth/token"

    def is_local(self) -> bool:
        return self.STAGE == STAGE.LOCAL
