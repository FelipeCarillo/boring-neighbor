from abc import ABC, abstractmethod
from datetime import date
from typing import Optional

from src.repositories.models.construction import ConstructionPhase
from src.helpers.enums import PhaseStatus


class ConstructionPhaseRepositoryInterface(ABC):
    """
    Interface for ConstructionPhase repository operations.
    """
    
    @abstractmethod
    def create(
        self,
        construction_id: str,
        phase_name: str,
        order: int,
        status: PhaseStatus = PhaseStatus.PENDING,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> ConstructionPhase:
        pass
    
    @abstractmethod
    def get_by_id(self, phase_id: str) -> Optional[ConstructionPhase]:
        pass
    
    @abstractmethod
    def list_by_construction(self, construction_id: str) -> list[ConstructionPhase]:
        pass
    
    @abstractmethod
    def update(self, phase_id: str, **kwargs) -> Optional[ConstructionPhase]:
        pass
    
    @abstractmethod
    def delete(self, phase_id: str) -> bool:
        pass


