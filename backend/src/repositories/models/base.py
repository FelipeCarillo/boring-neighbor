from datetime import datetime, UTC

from sqlalchemy import Column, DateTime, Boolean, UUID
from sqlalchemy.orm import DeclarativeBase, declared_attr


class TimestampMixin:
    """Mixin to add timestamp fields to models."""

    @declared_attr
    def created_by_user_id(cls):
        return Column(UUID, nullable=True)

    @declared_attr
    def updated_by_user_id(cls):
        return Column(UUID, nullable=True)

    @declared_attr
    def created_at(cls):
        return Column(DateTime, default=datetime.now(UTC))

    @declared_attr
    def updated_at(cls):
        return Column(DateTime, default=datetime.now(UTC), onupdate=datetime.now(UTC))
    

class SoftDeleteMixin:
    """Mixin to add soft delete functionality to models."""

    is_deleted = Column(Boolean, default=False)


class BaseModel(TimestampMixin, SoftDeleteMixin, DeclarativeBase):
    """Base class for all models."""
    pass
