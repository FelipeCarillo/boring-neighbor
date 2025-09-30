from abc import ABC, abstractmethod
from typing import Optional, List
from datetime import datetime

from repositories.models.construction import ConstructionProgress


class IConstructionProgressRepo(ABC):
    @abstractmethod
    def get_progress_by_id(self, id: str) -> Optional[ConstructionProgress]:
        pass

    @abstractmethod
    def create_progress(self, progress: ConstructionProgress) -> ConstructionProgress:
        pass

    @abstractmethod
    def update_progress(self, progress: ConstructionProgress) -> ConstructionProgress:
        pass

    @abstractmethod
    def delete_progress(self, id: str) -> None:
        pass

    @abstractmethod
    def list_progress_by_construction(self, construction_id: str) -> List[ConstructionProgress]:
        pass

    @abstractmethod
    def list_progress_by_recorder(self, recorder_id: str) -> List[ConstructionProgress]:
        pass

    @abstractmethod
    def list_progress_by_phase(self, phase: str) -> List[ConstructionProgress]:
        pass

    @abstractmethod
    def get_progress_by_date_range(self, start_date: datetime, end_date: datetime) -> List[ConstructionProgress]:
        pass

    @abstractmethod
    def get_latest_progress_by_construction(self, construction_id: str) -> Optional[ConstructionProgress]:
        pass
