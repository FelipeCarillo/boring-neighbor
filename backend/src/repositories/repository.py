from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from configs import ENV
from helpers.logger import get_logger
from .repositories.construction_3d_report_repo import Construction3DReportRepo, Construction3DReportRepoMock
from .repositories.construction_approval_repo import ConstructionApprovalRepo, ConstructionApprovalRepoMock
from .repositories.construction_phase_repo import ConstructionPhaseRepo, ConstructionPhaseRepoMock
from .repositories.construction_progress_repo import ConstructionProgressRepo, ConstructionProgressRepoMock
from .repositories.construction_repo import ConstructionRepo, ConstructionRepoMock
from .repositories.user_repo import UserRepo, UserRepoMock

logger = get_logger(__name__)


class Repository:
    construction_repo: ConstructionRepo
    construction_progress_repo: ConstructionProgressRepo
    construction_phase_repo: ConstructionPhaseRepo
    construction_approval_repo: ConstructionApprovalRepo
    construction_3d_report_repo: Construction3DReportRepo
    user_repo: UserRepo

    REPOS = {
            "construction_repo": (ConstructionRepo, ConstructionRepoMock),
            "construction_progress_repo": (ConstructionProgressRepo, ConstructionProgressRepoMock),
            "construction_phase_repo": (ConstructionPhaseRepo, ConstructionPhaseRepoMock),
            "construction_approval_repo": (ConstructionApprovalRepo, ConstructionApprovalRepoMock),
            "construction_3d_report_repo": (Construction3DReportRepo, Construction3DReportRepoMock),
            "user_repo": (UserRepo, UserRepoMock),
        }

    def __init__(self):
        logger.info("Inicializando Repository...")
        self.session = self.__connect_db()
        self._init_repos()
        logger.info("Repository inicializado com sucesso!")

    def __del__(self):
        if hasattr(self, "session"):
            logger.info("Fechando sessão do banco de dados...")
            self.session.close()
            logger.info("Sessão encerrada.")

    @staticmethod
    def __connect_db() -> Session:
        try:
            logger.info("Conectando ao banco de dados...")
            engine = create_engine(ENV.DATABASE_URL)
            logger.info("Conexão com o banco de dados estabelecida.")
            return Session(engine)
        except (SQLAlchemyError, Exception) as error:
            logger.exception("Erro ao conectar ao banco de dados!")
            raise Exception(f"Database connection error: {error}")

    def _init_repos(self):
        logger.info("Inicializando repositórios...")
        for name, (repo_cls, mock_cls) in self.REPOS.items():
            if ENV.is_local():
                repo = mock_cls()
                logger.debug(f"{name} → Mock carregado ({mock_cls.__name__})")
            else:
                repo = repo_cls(self.session)
                logger.debug(f"{name} → Repo real carregado ({repo_cls.__name__})")
            setattr(self, name, repo)
        logger.info("Todos os repositórios foram inicializados.")
