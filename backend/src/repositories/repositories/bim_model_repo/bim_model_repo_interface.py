from abc import ABC, abstractmethod
from typing import Optional
from src.repositories.models.construction import BIMModel


class BIMModelRepositoryInterface(ABC):
    """
    Interface for BIMModel repository operations.
    """
    
    @abstractmethod
    def create(
        self,
        construction_id: str,
        s3_key: str,
        file_name: str,
        file_size: int,
        uploaded_by: str,
        phase_id: Optional[str] = None,
        description: Optional[str] = None,
    ) -> BIMModel:
        pass
    
    @abstractmethod
    def get_by_id(self, model_id: str) -> Optional[BIMModel]:
        pass
    
    @abstractmethod
    def list_by_construction(self, construction_id: str) -> list[BIMModel]:
        pass
    
    @abstractmethod
    def list_by_phase(self, phase_id: str) -> list[BIMModel]:
        pass
    
    @abstractmethod
    def soft_delete(self, model_id: str) -> bool:
        pass

