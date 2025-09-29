from abc import ABC, abstractmethod
from typing import Optional, List

from repositories.models.user import User


class IUserRepo(ABC):
    @abstractmethod
    def get_user_by_email(self, email: str) -> Optional[User]:
        pass

    @abstractmethod
    def get_user_by_id(self, id: str) -> Optional[User]:
        pass

    @abstractmethod
    def create_user(self, user: User) -> User:
        pass

    @abstractmethod
    def update_user(self, user: User) -> User:
        pass

    @abstractmethod
    def delete_user(self, id: str) -> None:
        pass

    @abstractmethod
    def list_users(self) -> List[User]:
        pass

    @abstractmethod
    def get_user_by_cognito_user_id(self, cognito_user_id: str) -> Optional[User]:
        pass
