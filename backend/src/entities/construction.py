from datetime import date, datetime
from pydantic import Field
from typing import Optional

from src.entities.base import BaseEntity, BaseResponse
from src.entities.user import UserResponse
from src.helpers.enums import ConstructionStatus, PhaseStatus


class ConstructionCreate(BaseEntity):
    """
    Request model for creating a construction.
    """
    
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    location: str = Field(..., min_length=1, max_length=255)
    start_date: date
    end_date: Optional[date] = None


class ConstructionUpdate(BaseEntity):
    """
    Request model for updating a construction.
    """
    
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    location: Optional[str] = Field(None, min_length=1, max_length=255)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[ConstructionStatus] = None


class ConstructionResponse(BaseResponse):
    """
    Response model for construction data.
    """
    
    name: str
    description: Optional[str]
    location: str
    start_date: date
    end_date: Optional[date]
    status: ConstructionStatus
    created_by: str


class PhaseResponse(BaseResponse):
    """
    Response model for construction phase data.
    """
    
    construction_id: str
    phase_name: str
    status: PhaseStatus
    start_date: Optional[date]
    end_date: Optional[date]
    order: int


class BIMReferenceResponse(BaseResponse):
    """
    Response model for BIM reference data.
    """
    
    construction_id: str
    phase_id: Optional[str]
    s3_key: str
    uploaded_by: str
    description: Optional[str]
    presigned_url: Optional[str] = None


class ProgressResponse(BaseResponse):
    """
    Response model for construction progress data.
    """
    
    construction_id: str
    phase_id: Optional[str]
    s3_photo_key: str
    registered_by: str
    notes: Optional[str]
    deviation_score: Optional[float]
    presigned_url: Optional[str] = None


class ConstructionDetail(ConstructionResponse):
    """
    Detailed construction response with relationships.
    """
    
    assigned_users: list[UserResponse]
    phases: list[PhaseResponse]


class AssignUserRequest(BaseEntity):
    """
    Request model for assigning users to construction.
    """
    
    user_ids: list[str] = Field(..., min_length=1)


class BIMUploadRequest(BaseEntity):
    """
    Request model for BIM reference upload.
    """
    
    phase_id: Optional[str] = None
    description: Optional[str] = None


class ProgressCreate(BaseEntity):
    """
    Request model for creating progress entry.
    """
    
    construction_id: str
    phase_id: Optional[str] = None
    notes: Optional[str] = None


