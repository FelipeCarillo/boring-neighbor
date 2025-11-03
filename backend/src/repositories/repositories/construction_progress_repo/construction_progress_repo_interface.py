from abc import ABC, abstractmethod
from typing import Optional

from src.repositories.models.construction import ConstructionProgress


class ConstructionProgressRepositoryInterface(ABC):
    """
    Interface for ConstructionProgress repository operations.
    """
    
    @abstractmethod
    def create(
        self,
        construction_id: str,
        bim_reference_id: str,
        registered_by: str,
        s3_photo_key: str,
        notes: Optional[str] = None,
        deviation_score: Optional[float] = None,
    ) -> ConstructionProgress:
        pass
    
    @abstractmethod
    def get_by_id(self, progress_id: str) -> Optional[ConstructionProgress]:
        pass
    
    @abstractmethod
    def list_by_construction(self, construction_id: str) -> list[ConstructionProgress]:
        pass
    
    @abstractmethod
    def update(self, progress_id: str, **kwargs) -> Optional[ConstructionProgress]:
        pass
    
    @abstractmethod
    def list_by_bim_reference(self, bim_reference_id: str) -> list[ConstructionProgress]:
        pass
    
    @abstractmethod
    def list_without_deviation_score(self, construction_id: str) -> list[ConstructionProgress]:
        pass


