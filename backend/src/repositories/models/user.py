from sqlalchemy import Column, String, Boolean, UUID, Index
from sqlalchemy.orm import relationship

from .base import BaseModel


class User(BaseModel):
    """User model for RG-based authentication."""

    __tablename__ = 'users'

    id = Column(UUID, primary_key=True, index=True)
    rg = Column(String(7), nullable=False, unique=True, index=True)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    role = Column(String, nullable=False, default='viewer')  # admin, supervisor, worker, viewer
    is_active = Column(Boolean, nullable=False, default=True)

    # Relationships
    created_by_user_id = relationship("User", foreign_keys="User.created_by_user_id", back_populates="created_by")
    updated_by_user_id = relationship("User", foreign_keys="User.updated_by_user_id", back_populates="updated_by")

    # Index for fast RG lookups
    __table_args__ = (
        Index('idx_users_rg', 'rg'),
    )
