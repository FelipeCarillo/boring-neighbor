from typing import Optional, List
from sqlalchemy.orm import Session

from repositories.models.user import User
from .user_repo_interface import IUserRepo


class UserRepo(IUserRepo):

    def __init__(self, session: Session):
        self.session = session

    def get_user_by_email(self, email: str) -> Optional[User]:
        return self.session.query(User).filter(User.email == email).first()

    def get_user_by_id(self, id: str) -> Optional[User]:
        return self.session.query(User).filter(User.id == id).first()
    
    def create_user(self, user: User) -> User:
        self.session.add(user)
        self.session.commit()
        return user

    def update_user(self, user: User) -> User:
        self.session.commit()
        return user
    
    def delete_user(self, id: str) -> None:
        user = self.get_user_by_id(id)
        if user:
            self.session.delete(user)
            self.session.commit()

    def list_users(self) -> List[User]:
        return self.session.query(User).all()
    
    def get_user_by_cognito_user_id(self, cognito_user_id: str) -> Optional[User]:
        return self.session.query(User).filter(User.cognito_user_id == cognito_user_id).first()
