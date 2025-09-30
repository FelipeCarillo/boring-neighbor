from typing import Optional, List
from repositories.models.user import User
from .user_repo_interface import IUserRepo


class UserRepoMock(IUserRepo):

    def __init__(self):
        self.users = [
            User(
                id="1",
                email="teste@teste.com",
                name="Teste",
                cognito_user_id="1",
                cognito_groups=["admin"],
            ),
        ]

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email address."""
        for user in self.users:
            if user.email == email:
                return user
        return None

    def get_user_by_id(self, id: str) -> Optional[User]:
        """Get user by ID."""
        for user in self.users:
            if user.id == id:
                return user
        return None

    def create_user(self, user: User) -> User:
        """Create a new user."""
        # Generate a simple ID if not provided
        if not user.id:
            user.id = str(len(self.users) + 1)
        self.users.append(user)
        return user

    def update_user(self, user: User) -> User:
        """Update an existing user."""
        for i, existing_user in enumerate(self.users):
            if existing_user.id == user.id:
                self.users[i] = user
                return user
        # If user not found, create it
        return self.create_user(user)

    def delete_user(self, id: str) -> None:
        """Delete a user by ID."""
        self.users = [user for user in self.users if user.id != id]

    def list_users(self) -> List[User]:
        """List all users."""
        return self.users.copy()

    def get_user_by_cognito_user_id(self, cognito_user_id: str) -> Optional[User]:
        """Get user by Cognito user ID."""
        for user in self.users:
            if user.cognito_user_id == cognito_user_id:
                return user
        return None