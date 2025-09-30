from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class TimestampMixin(BaseModel):
    """Mixin to add timestamp fields to entities."""
    
    created_by_user_id: Optional[UUID] = Field(None, description="ID of the user who created the record")
    updated_by_user_id: Optional[UUID] = Field(None, description="ID of the user who last updated the record")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the record was created")
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp when the record was last updated")


class SoftDeleteMixin(BaseModel):
    """Mixin to add soft delete functionality to entities."""
    
    is_deleted: bool = Field(False, description="Whether the record is soft deleted")


class BaseEntity(TimestampMixin, SoftDeleteMixin):
    """Base class for all entities."""
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            UUID: lambda v: str(v)
        }
