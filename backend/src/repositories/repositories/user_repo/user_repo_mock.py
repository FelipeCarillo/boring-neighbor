from typing import Optional, List
from uuid import UUID

from entities.user import User
from .user_repo_interface import IUserRepo


class UserRepoMock(IUserRepo):
    """Mock implementation of User repository for local development."""

    def __init__(self):
        self.users: List[User] = []
        # Add default admin user
        admin_user = User(
            id="00000000-0000-0000-0000-000000000001",
            rg="1234567",
            password_hash="$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2",  # password: admin123
            name="Administrador",
            email="admin@metrosp.com",
            role="admin",
            is_active=True
        )
        self.users.append(admin_user)

    def create_user(self, user: User) -> User:
        """Create a new user."""
        # Check if RG already exists
        if any(u.rg == user.rg for u in self.users):
            raise ValueError("RG already exists")
        
        self.users.append(user)
        return user

    def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        """Get user by ID."""
        return next((u for u in self.users if u.id == str(user_id)), None)

    def get_user_by_rg(self, rg: str) -> Optional[User]:
        """Get user by RG."""
        return next((u for u in self.users if u.rg == rg), None)

    def update_user(self, user: User) -> Optional[User]:
        """Update user."""
        for i, u in enumerate(self.users):
            if u.id == user.id:
                self.users[i] = user
                return user
        return None

    def delete_user(self, user_id: UUID) -> bool:
        """Soft delete user."""
        for i, u in enumerate(self.users):
            if u.id == str(user_id):
                del self.users[i]
                return True
        return False

    def list_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """List users with pagination."""
        return self.users[skip:skip + limit]
