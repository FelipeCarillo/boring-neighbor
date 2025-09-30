from abc import ABC, abstractmethod
from typing import Optional, List

from repositories.models.construction import ConstructionPhase


class IConstructionPhaseRepo(ABC):
    @abstractmethod
    def get_phase_by_id(self, id: str) -> Optional[ConstructionPhase]:
        pass

    @abstractmethod
    def get_phase_by_name(self, name: str) -> Optional[ConstructionPhase]:
        pass

    @abstractmethod
    def create_phase(self, phase: ConstructionPhase) -> ConstructionPhase:
        pass

    @abstractmethod
    def update_phase(self, phase: ConstructionPhase) -> ConstructionPhase:
        pass

    @abstractmethod
    def delete_phase(self, id: str) -> None:
        pass

    @abstractmethod
    def list_phases(self) -> List[ConstructionPhase]:
        pass

    @abstractmethod
    def list_active_phases(self) -> List[ConstructionPhase]:
        pass

    @abstractmethod
    def get_phases_by_order(self) -> List[ConstructionPhase]:
        pass
