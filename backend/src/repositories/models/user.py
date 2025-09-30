from sqlalchemy import Column, String, UUID, Text
from sqlalchemy.orm import relationship

from .base import BaseModel


class User(BaseModel):
    """User model representing a user in the system with Cognito integration."""

    __tablename__ = 'users'

    id = Column(UUID, primary_key=True, index=True)
    email = Column(String, nullable=False, unique=True, index=True)
    name = Column(String, nullable=False)
    avatar_key = Column(String, nullable=True)
    cognito_user_id = Column(String, nullable=False, unique=True, index=True)  # AWS Cognito user ID (required)
    cognito_groups = Column(Text, nullable=True)  # JSON string with Cognito groups: ["admin", "supervisor"]
    
    # Relationships
    construction_approvals = relationship("ConstructionApproval", foreign_keys="ConstructionApproval.approver_id", back_populates="approver", cascade="all, delete-orphan")
    construction_permissions = relationship("ConstructionApproval", foreign_keys="ConstructionApproval.user_id", back_populates="user", cascade="all, delete-orphan")
    uploaded_documents = relationship("ConstructionDocument", back_populates="uploader", cascade="all, delete-orphan")
    supervised_constructions = relationship("Construction", back_populates="assigned_supervisor", foreign_keys="Construction.assigned_supervisor_id")
    progress_records = relationship("ConstructionProgress", back_populates="recorder", cascade="all, delete-orphan")
