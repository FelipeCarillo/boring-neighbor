from abc import ABC, abstractmethod
from datetime import date
from typing import Optional

from src.repositories.models.construction import Construction
from src.helpers.enums import ConstructionStatus


class ConstructionRepositoryInterface(ABC):
    """
    Interface for Construction repository operations.
    """
    
    @abstractmethod
    def create(
        self,
        name: str,
        location: str,
        start_date: date,
        created_by: str,
        description: Optional[str] = None,
        end_date: Optional[date] = None,
    ) -> Construction:
        pass
    
    @abstractmethod
    def get_by_id(self, construction_id: str) -> Optional[Construction]:
        pass
    
    @abstractmethod
    def list_all(self, include_deleted: bool = False) -> list[Construction]:
        pass
    
    @abstractmethod
    def list_by_user(self, user_id: str) -> list[Construction]:
        pass
    
    @abstractmethod
    def update(self, construction_id: str, **kwargs) -> Optional[Construction]:
        pass
    
    @abstractmethod
    def soft_delete(self, construction_id: str) -> bool:
        pass
    
    @abstractmethod
    def assign_user(self, construction_id: str, user_id: str) -> bool:
        pass
    
    @abstractmethod
    def remove_user(self, construction_id: str, user_id: str) -> bool:
        pass
    
    @abstractmethod
    def is_user_assigned(self, construction_id: str, user_id: str) -> bool:
        pass


