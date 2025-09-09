from abc import ABC, abstractmethod
from typing import Optional, List
from datetime import datetime

from repositories.models.construction import Construction


class IConstructionRepo(ABC):
    @abstractmethod
    def get_construction_by_id(self, id: str) -> Optional[Construction]:
        pass

    @abstractmethod
    def create_construction(self, construction: Construction) -> Construction:
        pass

    @abstractmethod
    def update_construction(self, construction: Construction) -> Construction:
        pass

    @abstractmethod
    def delete_construction(self, id: str) -> None:
        pass

    @abstractmethod
    def list_constructions(self) -> List[Construction]:
        pass

    @abstractmethod
    def get_constructions_by_supervisor(self, supervisor_id: str) -> List[Construction]:
        pass

    @abstractmethod
    def get_constructions_by_status(self, status: str) -> List[Construction]:
        pass

    @abstractmethod
    def get_constructions_by_phase(self, phase: str) -> List[Construction]:
        pass

    @abstractmethod
    def search_constructions_by_name(self, name: str) -> List[Construction]:
        pass

    @abstractmethod
    def get_constructions_by_date_range(self, start_date: datetime, end_date: datetime) -> List[Construction]:
        pass
