from datetime import datetime
from pydantic import BaseModel, ConfigDict


class BaseEntity(BaseModel):
    """
    Base Pydantic model for all entities.
    """
    
    model_config = ConfigDict(from_attributes=True)


class BaseResponse(BaseEntity):
    """
    Base response model with common fields.
    """
    
    id: str
    created_at: datetime
    updated_at: datetime


