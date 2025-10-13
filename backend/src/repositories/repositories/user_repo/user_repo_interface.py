from abc import ABC, abstractmethod
from typing import Optional, List
from uuid import UUID

from entities.user import User


class IUserRepo(ABC):
    """Interface for User repository."""

    @abstractmethod
    def create_user(self, user: User) -> User:
        """Create a new user."""
        pass

    @abstractmethod
    def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        """Get user by ID."""
        pass

    @abstractmethod
    def get_user_by_rg(self, rg: str) -> Optional[User]:
        """Get user by RG."""
        pass

    @abstractmethod
    def update_user(self, user: User) -> Optional[User]:
        """Update user."""
        pass

    @abstractmethod
    def delete_user(self, user_id: UUID) -> bool:
        """Soft delete user."""
        pass

    @abstractmethod
    def list_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """List users with pagination."""
        pass
