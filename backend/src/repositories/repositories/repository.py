from sqlalchemy.orm import Session

from helpers.enums import STAGE
from .user_repo import UserRepo, UserRepoMock


class Repository:
    def __init__(self, stage: STAGE):
        session = ""
        self.user_repo = self.get_user_repo(stage, session, UserRepo, UserRepoMock)

    @staticmethod
    def get_user_repo(stage: STAGE, session: Session, user_repo: UserRepo, user_repo_mock: UserRepoMock):
        if stage == STAGE.LOCAL:
            return user_repo_mock()
        return user_repo(session)

