import os

from dotenv import load_dotenv
from pydantic import BaseModel

from helpers.enums import STAGE

load_dotenv()


class Env(BaseModel):
    STAGE: STAGE = os.environ.get("STAGE", STAGE.LOCAL)
    DATABASE_URL: str = os.environ.get("DATABASE_URL", "")

    def is_local(self) -> bool:
        return self.STAGE == STAGE.LOCAL
