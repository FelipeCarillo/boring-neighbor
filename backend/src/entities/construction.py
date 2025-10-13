from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator

from .base import BaseEntity


class Construction(BaseEntity):
    """Construction entity representing a construction project for progress tracking."""
    
    id: str = Field(..., description="Unique identifier for the construction")
    name: str = Field(..., description="Name of the construction project")
    description: Optional[str] = Field(None, description="Description of the construction project")
    location: Optional[str] = Field(None, description="Location of the construction")
    start_date: Optional[datetime] = Field(None, description="Start date of the construction")
    end_date: Optional[datetime] = Field(None, description="End date of the construction")
    status: str = Field(..., description="Status of the construction: planned, in_progress, completed, cancelled")
    
    # Progress tracking fields
    current_phase: Optional[str] = Field(None, description="Current phase of the construction")
    progress_percentage: float = Field(0.0, ge=0.0, le=100.0, description="Progress percentage from 0.0 to 100.0")
    assigned_supervisor_id: Optional[str] = Field(None, description="ID of the assigned supervisor")
    
    # S3 integration
    s3_folder_key: Optional[str] = Field(None, description="S3 folder key for progress photos and documents")
    
    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        allowed_statuses = ['planned', 'in_progress', 'completed', 'cancelled']
        if v not in allowed_statuses:
            raise ValueError(f'Status must be one of: {allowed_statuses}')
        return v


class ConstructionCreate(BaseModel):
    """Schema for creating a new construction."""
    
    name: str = Field(..., description="Name of the construction project")
    description: Optional[str] = Field(None, description="Description of the construction project")
    location: Optional[str] = Field(None, description="Location of the construction")
    start_date: Optional[datetime] = Field(None, description="Start date of the construction")
    end_date: Optional[datetime] = Field(None, description="End date of the construction")
    status: str = Field('planned', description="Status of the construction")
    current_phase: Optional[str] = Field(None, description="Current phase of the construction")
    progress_percentage: float = Field(0.0, ge=0.0, le=100.0, description="Progress percentage from 0.0 to 100.0")
    assigned_supervisor_id: Optional[str] = Field(None, description="ID of the assigned supervisor")
    s3_folder_key: Optional[str] = Field(None, description="S3 folder key for progress photos and documents")
    
    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        allowed_statuses = ['planned', 'in_progress', 'completed', 'cancelled']
        if v not in allowed_statuses:
            raise ValueError(f'Status must be one of: {allowed_statuses}')
        return v


class ConstructionUpdate(BaseModel):
    """Schema for updating an existing construction."""
    
    name: Optional[str] = Field(None, description="Name of the construction project")
    description: Optional[str] = Field(None, description="Description of the construction project")
    location: Optional[str] = Field(None, description="Location of the construction")
    start_date: Optional[datetime] = Field(None, description="Start date of the construction")
    end_date: Optional[datetime] = Field(None, description="End date of the construction")
    status: Optional[str] = Field(None, description="Status of the construction")
    current_phase: Optional[str] = Field(None, description="Current phase of the construction")
    progress_percentage: Optional[float] = Field(None, ge=0.0, le=100.0, description="Progress percentage from 0.0 to 100.0")
    assigned_supervisor_id: Optional[str] = Field(None, description="ID of the assigned supervisor")
    s3_folder_key: Optional[str] = Field(None, description="S3 folder key for progress photos and documents")
    
    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        if v is not None:
            allowed_statuses = ['planned', 'in_progress', 'completed', 'cancelled']
            if v not in allowed_statuses:
                raise ValueError(f'Status must be one of: {allowed_statuses}')
        return v


class ConstructionProgress(BaseEntity):
    """ConstructionProgress entity for tracking daily/weekly construction progress."""
    
    id: str = Field(..., description="Unique identifier for the progress record")
    construction_id: str = Field(..., description="ID of the construction project")
    recorded_by: str = Field(..., description="ID of the user who recorded the progress")
    
    progress_percentage: float = Field(..., ge=0.0, le=100.0, description="Progress percentage from 0.0 to 100.0")
    phase: str = Field(..., description="Current phase of the construction")
    
    workers_count: Optional[int] = Field(None, ge=0, description="Number of workers on site")
    hours_worked: Optional[float] = Field(None, ge=0.0, description="Hours worked")
    
    progress_photos_count: int = Field(0, ge=0, description="Number of progress photos taken")
    s3_photos_key: Optional[str] = Field(None, description="S3 key for progress photos")
    
    notes: Optional[str] = Field(None, description="Additional notes about the progress")
    issues_identified: Optional[str] = Field(None, description="Issues identified during the progress")
    weather_conditions: Optional[str] = Field(None, description="Weather conditions during the progress")


class ConstructionProgressCreate(BaseModel):
    """Schema for creating a new construction progress record."""
    
    construction_id: str = Field(..., description="ID of the construction project")
    recorded_by: str = Field(..., description="ID of the user who recorded the progress")
    progress_percentage: float = Field(..., ge=0.0, le=100.0, description="Progress percentage from 0.0 to 100.0")
    phase: str = Field(..., description="Current phase of the construction")
    workers_count: Optional[int] = Field(None, ge=0, description="Number of workers on site")
    hours_worked: Optional[float] = Field(None, ge=0.0, description="Hours worked")
    progress_photos_count: int = Field(0, ge=0, description="Number of progress photos taken")
    s3_photos_key: Optional[str] = Field(None, description="S3 key for progress photos")
    notes: Optional[str] = Field(None, description="Additional notes about the progress")
    issues_identified: Optional[str] = Field(None, description="Issues identified during the progress")
    weather_conditions: Optional[str] = Field(None, description="Weather conditions during the progress")


class ConstructionProgressUpdate(BaseModel):
    """Schema for updating an existing construction progress record."""
    
    progress_percentage: Optional[float] = Field(None, ge=0.0, le=100.0, description="Progress percentage from 0.0 to 100.0")
    phase: Optional[str] = Field(None, description="Current phase of the construction")
    workers_count: Optional[int] = Field(None, ge=0, description="Number of workers on site")
    hours_worked: Optional[float] = Field(None, ge=0.0, description="Hours worked")
    progress_photos_count: Optional[int] = Field(None, ge=0, description="Number of progress photos taken")
    s3_photos_key: Optional[str] = Field(None, description="S3 key for progress photos")
    notes: Optional[str] = Field(None, description="Additional notes about the progress")
    issues_identified: Optional[str] = Field(None, description="Issues identified during the progress")
    weather_conditions: Optional[str] = Field(None, description="Weather conditions during the progress")


class ConstructionPhase(BaseEntity):
    """ConstructionPhase entity defining the phases of a construction project."""
    
    id: str = Field(..., description="Unique identifier for the construction phase")
    name: str = Field(..., description="Name of the construction phase")
    description: Optional[str] = Field(None, description="Description of the construction phase")
    order: int = Field(..., description="Order of the phase in the construction process")
    estimated_duration_days: Optional[int] = Field(None, ge=0, description="Estimated duration in days")
    is_active: bool = Field(True, description="Whether the phase is currently active")


class ConstructionPhaseCreate(BaseModel):
    """Schema for creating a new construction phase."""
    
    name: str = Field(..., description="Name of the construction phase")
    description: Optional[str] = Field(None, description="Description of the construction phase")
    order: int = Field(..., description="Order of the phase in the construction process")
    estimated_duration_days: Optional[int] = Field(None, ge=0, description="Estimated duration in days")
    is_active: bool = Field(True, description="Whether the phase is currently active")


class ConstructionPhaseUpdate(BaseModel):
    """Schema for updating an existing construction phase."""
    
    name: Optional[str] = Field(None, description="Name of the construction phase")
    description: Optional[str] = Field(None, description="Description of the construction phase")
    order: Optional[int] = Field(None, description="Order of the phase in the construction process")
    estimated_duration_days: Optional[int] = Field(None, ge=0, description="Estimated duration in days")
    is_active: Optional[bool] = Field(None, description="Whether the phase is currently active")


class ConstructionApproval(BaseEntity):
    """ConstructionApproval entity for managing user permissions on construction projects."""
    
    id: str = Field(..., description="Unique identifier for the construction approval")
    construction_id: str = Field(..., description="ID of the construction project")
    user_id: str = Field(..., description="ID of the user being granted permissions")
    approver_id: str = Field(..., description="ID of the user who approved the permissions")
    status: str = Field(..., description="Status of the approval: pending, approved, rejected")
    
    # Permissions granted to the user
    can_view: bool = Field(False, description="Can view the construction")
    can_edit: bool = Field(False, description="Can edit the construction")
    can_delete: bool = Field(False, description="Can delete the construction")
    can_approve: bool = Field(False, description="Can approve other users")
    can_manage_users: bool = Field(False, description="Can manage user permissions")
    
    # Additional metadata
    comments: Optional[str] = Field(None, description="Comments about the approval")
    expires_at: Optional[datetime] = Field(None, description="Expiration date for the permissions")
    
    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        allowed_statuses = ['pending', 'approved', 'rejected']
        if v not in allowed_statuses:
            raise ValueError(f'Status must be one of: {allowed_statuses}')
        return v


class ConstructionApprovalCreate(BaseModel):
    """Schema for creating a new construction approval."""
    
    construction_id: str = Field(..., description="ID of the construction project")
    user_id: str = Field(..., description="ID of the user being granted permissions")
    approver_id: str = Field(..., description="ID of the user who approved the permissions")
    status: str = Field('pending', description="Status of the approval")
    can_view: bool = Field(False, description="Can view the construction")
    can_edit: bool = Field(False, description="Can edit the construction")
    can_delete: bool = Field(False, description="Can delete the construction")
    can_approve: bool = Field(False, description="Can approve other users")
    can_manage_users: bool = Field(False, description="Can manage user permissions")
    comments: Optional[str] = Field(None, description="Comments about the approval")
    expires_at: Optional[datetime] = Field(None, description="Expiration date for the permissions")
    
    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        allowed_statuses = ['pending', 'approved', 'rejected']
        if v not in allowed_statuses:
            raise ValueError(f'Status must be one of: {allowed_statuses}')
        return v


class ConstructionApprovalUpdate(BaseModel):
    """Schema for updating an existing construction approval."""
    
    status: Optional[str] = Field(None, description="Status of the approval")
    can_view: Optional[bool] = Field(None, description="Can view the construction")
    can_edit: Optional[bool] = Field(None, description="Can edit the construction")
    can_delete: Optional[bool] = Field(None, description="Can delete the construction")
    can_approve: Optional[bool] = Field(None, description="Can approve other users")
    can_manage_users: Optional[bool] = Field(None, description="Can manage user permissions")
    comments: Optional[str] = Field(None, description="Comments about the approval")
    expires_at: Optional[datetime] = Field(None, description="Expiration date for the permissions")
    
    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        if v is not None:
            allowed_statuses = ['pending', 'approved', 'rejected']
            if v not in allowed_statuses:
                raise ValueError(f'Status must be one of: {allowed_statuses}')
        return v


class Construction3DReport(BaseEntity):
    """Construction3DReport entity for storing 3D analysis results."""
    
    id: str = Field(..., description="Unique identifier for the 3D report")
    construction_id: str = Field(..., description="ID of the construction project")
    s3_ply_key: str = Field(..., description="S3 key for the PLY file")
    s3_obj_key: str = Field(..., description="S3 key for the OBJ file")
    status: str = Field(..., description="Status of the processing: pending, processing, completed, failed")
    report_json: Optional[str] = Field(None, description="JSON report data")
    processing_started_at: Optional[datetime] = Field(None, description="When processing started")
    processing_completed_at: Optional[datetime] = Field(None, description="When processing completed")
    error_message: Optional[str] = Field(None, description="Error message if processing failed")
    
    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        allowed_statuses = ['pending', 'processing', 'completed', 'failed']
        if v not in allowed_statuses:
            raise ValueError(f'Status must be one of: {allowed_statuses}')
        return v


class Construction3DReportCreate(BaseModel):
    """Schema for creating a new 3D report."""
    
    construction_id: str = Field(..., description="ID of the construction project")
    s3_ply_key: str = Field(..., description="S3 key for the PLY file")
    s3_obj_key: str = Field(..., description="S3 key for the OBJ file")
    status: str = Field('pending', description="Status of the processing")
    report_json: Optional[str] = Field(None, description="JSON report data")
    processing_started_at: Optional[datetime] = Field(None, description="When processing started")
    processing_completed_at: Optional[datetime] = Field(None, description="When processing completed")
    error_message: Optional[str] = Field(None, description="Error message if processing failed")
    
    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        allowed_statuses = ['pending', 'processing', 'completed', 'failed']
        if v not in allowed_statuses:
            raise ValueError(f'Status must be one of: {allowed_statuses}')
        return v


class Construction3DReportUpdate(BaseModel):
    """Schema for updating an existing 3D report."""
    
    status: Optional[str] = Field(None, description="Status of the processing")
    report_json: Optional[str] = Field(None, description="JSON report data")
    processing_started_at: Optional[datetime] = Field(None, description="When processing started")
    processing_completed_at: Optional[datetime] = Field(None, description="When processing completed")
    error_message: Optional[str] = Field(None, description="Error message if processing failed")
    
    @field_validator('status')
    @classmethod
    def validate_status(cls, v):
        if v is not None:
            allowed_statuses = ['pending', 'processing', 'completed', 'failed']
            if v not in allowed_statuses:
                raise ValueError(f'Status must be one of: {allowed_statuses}')
        return v