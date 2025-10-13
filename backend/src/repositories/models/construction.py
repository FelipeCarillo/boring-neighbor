from sqlalchemy import Column, String, DateTime, UUID, Text, Float, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from .base import BaseModel


class Construction(BaseModel):
    """Construction model representing a construction project for progress tracking."""

    __tablename__ = 'constructions'

    id = Column(UUID, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    status = Column(String, nullable=False, default='planned')  # planned, in_progress, completed, cancelled

    # Progress tracking fields
    current_phase = Column(String, nullable=True)  # foundation, structure, finishing, etc.
    progress_percentage = Column(Float, nullable=False, default=0.0)  # 0.0 to 100.0
    assigned_supervisor_id = Column(String, nullable=True, index=True)

    # S3 integration for progress photos and documents
    s3_folder_key = Column(String, nullable=True)

    # Relationships
    progress_records = relationship("ConstructionProgress", back_populates="construction", cascade="all, delete-orphan")
    approvals = relationship("ConstructionApproval", back_populates="construction", cascade="all, delete-orphan")
    reports_3d = relationship("Construction3DReport", back_populates="construction", cascade="all, delete-orphan")


class ConstructionProgress(BaseModel):
    """ConstructionProgress model for tracking daily/weekly construction progress."""

    __tablename__ = 'construction_progress'

    id = Column(UUID, primary_key=True)
    construction_id = Column(String, ForeignKey('constructions.id'), nullable=False, index=True)
    recorded_by = Column(String, nullable=False, index=True)

    progress_percentage = Column(Float, nullable=False, default=0.0)  # 0.0 to 100.0
    phase = Column(String, nullable=False)

    workers_count = Column(Integer, nullable=True)
    hours_worked = Column(Float, nullable=True)

    progress_photos_count = Column(Integer, nullable=False, default=0)
    s3_photos_key = Column(String, nullable=True)  # S3 key for progress photos

    notes = Column(Text, nullable=True)
    issues_identified = Column(Text, nullable=True)
    weather_conditions = Column(String, nullable=True)  # sunny, rainy, cloudy, etc.

    # Relationships
    construction = relationship("Construction", back_populates="progress_records")


class ConstructionPhase(BaseModel):
    """ConstructionPhase model defining the phases of a construction project."""

    __tablename__ = 'construction_phases'

    id = Column(UUID, primary_key=True)
    name = Column(String, nullable=False, unique=True)  # foundation, structure, finishing, etc.
    description = Column(Text, nullable=True)
    order = Column(Integer, nullable=False)  # Order of phases (1, 2, 3...)
    estimated_duration_days = Column(Integer, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)


class ConstructionApproval(BaseModel):
    """ConstructionApproval model for managing user permissions on construction projects."""

    __tablename__ = 'construction_approvals'

    id = Column(UUID, primary_key=True)
    construction_id = Column(String, ForeignKey('constructions.id'), nullable=False, index=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=False, index=True)  # User being granted permissions
    approver_id = Column(String, nullable=False, index=True)  # User who approved the permissions
    status = Column(String, nullable=False, default='pending')  # pending, approved, rejected

    # Permissions granted to the user
    can_view = Column(Boolean, nullable=False, default=False)
    can_edit = Column(Boolean, nullable=False, default=False)
    can_delete = Column(Boolean, nullable=False, default=False)
    can_approve = Column(Boolean, nullable=False, default=False)
    can_manage_users = Column(Boolean, nullable=False, default=False)

    # Additional metadata
    comments = Column(Text, nullable=True)
    expires_at = Column(DateTime, nullable=True)  # Optional expiration date for permissions

    # Relationships
    construction = relationship("Construction", back_populates="approvals")


class Construction3DReport(BaseModel):
    """Construction3DReport model for storing 3D analysis results."""

    __tablename__ = 'construction_3d_reports'

    id = Column(UUID, primary_key=True)
    construction_id = Column(String, ForeignKey('constructions.id'), nullable=False, index=True)

    s3_ply_key = Column(String, nullable=False)
    s3_obj_key = Column(String, nullable=False)

    status = Column(String, nullable=False, default='pending')
    report_json = Column(Text, nullable=True)

    processing_started_at = Column(DateTime, nullable=True)
    processing_completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)

    # Relationships
    construction = relationship("Construction", back_populates="3d_reports")
