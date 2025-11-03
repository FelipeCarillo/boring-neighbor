from abc import ABC, abstractmethod
from typing import Optional

from src.repositories.models.user import User
from src.helpers.enums import UserRole


class UserRepositoryInterface(ABC):
    """
    Interface for User repository operations.
    """
    
    @abstractmethod
    def create(
        self,
        registro: str,
        password_hash: str,
        name: str,
        email: str,
        role: UserRole,
    ) -> User:
        pass
    
    @abstractmethod
    def get_by_id(self, user_id: str) -> Optional[User]:
        pass
    
    @abstractmethod
    def get_by_registro(self, registro: str) -> Optional[User]:
        pass
    
    @abstractmethod
    def get_by_email(self, email: str) -> Optional[User]:
        pass
    
    @abstractmethod
    def list_all(self, include_deleted: bool = False) -> list[User]:
        pass
    
    @abstractmethod
    def update(self, user_id: str, **kwargs) -> Optional[User]:
        pass
    
    @abstractmethod
    def soft_delete(self, user_id: str) -> bool:
        pass


