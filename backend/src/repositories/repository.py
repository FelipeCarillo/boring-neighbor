from sqlalchemy import create_engine, NullPool
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from configs import ENV
from .repositories.construction_approval_repo import ConstructionApprovalRepo, IConstructionApprovalRepo, \
    ConstructionApprovalRepoMock
from .repositories.construction_phase_repo import ConstructionPhaseRepo, IConstructionPhaseRepo, \
    ConstructionPhaseRepoMock
from .repositories.construction_progress_repo import ConstructionProgressRepo, IConstructionProgressRepo, \
    ConstructionProgressRepoMock
from .repositories.construction_repo import ConstructionRepo, IConstructionRepo, ConstructionRepoMock
from .repositories.user_repo import UserRepo, IUserRepo, UserRepoMock


class Repository:
    def __init__(self):
        self.session = self.__connect_db()
        self.user_repo = self.get_user_repo()
        self.construction_repo = self.get_construction_repo()
        self.construction_progress_repo = self.get_construction_progress_repo()
        self.construction_phase_repo = self.get_construction_phase_repo()
        self.construction_approval_repo = self.get_construction_approval_repo()

    def __del__(self):
        if hasattr(self, 'session'):
            self.session.close()

    @staticmethod
    def __connect_db() -> Session:
        try:
            engine = create_engine(ENV.DATABASE_URL, poolclass=NullPool)
            return Session(engine)
        except (SQLAlchemyError, Exception) as error:
            raise Exception(f"Database connection error: {error}")

    def get_user_repo(self) -> IUserRepo:
        if ENV.is_local():
            return UserRepoMock()
        return UserRepo(self.session)

    def get_construction_repo(self) -> IConstructionRepo:
        if ENV.is_local():
            return ConstructionRepoMock()
        return ConstructionRepo(self.session)

    def get_construction_progress_repo(self) -> IConstructionProgressRepo:
        if ENV.is_local():
            return ConstructionProgressRepoMock()
        return ConstructionProgressRepo(self.session)

    def get_construction_phase_repo(self) -> IConstructionPhaseRepo:
        if ENV.is_local():
            return ConstructionPhaseRepoMock()
        return ConstructionPhaseRepo(self.session)

    def get_construction_approval_repo(self) -> IConstructionApprovalRepo:
        if ENV.is_local():
            return ConstructionApprovalRepoMock()
        return ConstructionApprovalRepo(self.session)
