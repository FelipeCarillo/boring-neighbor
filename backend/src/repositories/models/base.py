from datetime import datetime, UTC

from sqlalchemy import Column, DateTime, Boolean, UUID
from sqlalchemy.orm import DeclarativeBase, relationship


class TimestampMixin:
    """Mixin to add timestamp fields to models."""

    created_by_user_id = Column(UUID, nullable=True)
    updated_by_user_id = Column(UUID, nullable=True)
    created_at = Column(DateTime, default=datetime.now(UTC))
    updated_at = Column(DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC))

    created_by = relationship("User", back_populates="created_by_user_id")
    updated_by = relationship("User", back_populates="updated_by_user_id")
    

class SoftDeleteMixin:
    """Mixin to add soft delete functionality to models."""

    is_deleted = Column(Boolean, default=False)


class BaseModel(DeclarativeBase, TimestampMixin, SoftDeleteMixin):
    """Base class for all models."""
    pass
