from datetime import datetime
from sqlalchemy import String, Text, Date, ForeignKey, Table, Column, Enum as SQLEnum, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING

from src.repositories.models.base import BaseModel, Base
from src.helpers.enums import ConstructionStatus

if TYPE_CHECKING:
    from src.repositories.models.user import User


construction_users = Table(
    "construction_users",
    Base.metadata,
    Column("construction_id", String(36), ForeignKey("constructions.id", ondelete="CASCADE"), primary_key=True),
    Column("user_id", String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
)


class Construction(BaseModel):
    """
    Construction model representing a Metro SP construction project.
    """
    
    __tablename__ = "constructions"
    
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    start_date: Mapped[datetime] = mapped_column(Date, nullable=False)
    end_date: Mapped[datetime | None] = mapped_column(Date, nullable=True)
    status: Mapped[ConstructionStatus] = mapped_column(
        SQLEnum(ConstructionStatus),
        default=ConstructionStatus.PLANNED,
        nullable=False,
    )
    created_by: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    
    model_3d_s3_key: Mapped[str | None] = mapped_column(String(500), nullable=True)
    model_3d_file_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    model_3d_file_size: Mapped[int | None] = mapped_column(Integer, nullable=True)
    model_3d_file_type: Mapped[str | None] = mapped_column(String(10), nullable=True)  # obj, gltf, glb, fbx
    
    created_by_user: Mapped["User"] = relationship(
        "User",
        back_populates="created_constructions",
        foreign_keys=[created_by],
    )
    
    assigned_users: Mapped[list["User"]] = relationship(
        "User",
        secondary=construction_users,
        back_populates="assigned_constructions",
    )
    
    bim_references: Mapped[list["BIMReference"]] = relationship(
        "BIMReference",
        back_populates="construction",
        cascade="all, delete-orphan",
    )
    
    bim_models: Mapped[list["BIMModel"]] = relationship(
        "BIMModel",
        back_populates="construction",
        cascade="all, delete-orphan",
    )
    
    progress_entries: Mapped[list["ConstructionProgress"]] = relationship(
        "ConstructionProgress",
        back_populates="construction",
        cascade="all, delete-orphan",
    )
    
    deviation_reports: Mapped[list["DeviationReport"]] = relationship(
        "DeviationReport",
        back_populates="construction",
        cascade="all, delete-orphan",
    )


class BIMReference(BaseModel):
    """
    BIM reference image uploaded for comparison with progress photos.
    """
    
    __tablename__ = "bim_references"
    
    construction_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("constructions.id", ondelete="CASCADE"),
        nullable=False,
    )
    s3_key: Mapped[str] = mapped_column(String(500), nullable=False)
    uploaded_by: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    construction: Mapped["Construction"] = relationship(
        "Construction",
        back_populates="bim_references",
    )
    
    uploaded_by_user: Mapped["User"] = relationship(
        "User",
        back_populates="uploaded_bim_references",
    )
    
    progress_entries: Mapped[list["ConstructionProgress"]] = relationship(
        "ConstructionProgress",
        back_populates="bim_reference",
        cascade="all, delete-orphan",
    )


class BIMModel(BaseModel):
    """
    BIM model file (.ifc) uploaded for 3D visualization.
    """
    
    __tablename__ = "bim_models"
    
    construction_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("constructions.id", ondelete="CASCADE"),
        nullable=False,
    )
    s3_key: Mapped[str] = mapped_column(String(500), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_size: Mapped[int] = mapped_column(nullable=False)
    uploaded_by: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    construction: Mapped["Construction"] = relationship(
        "Construction",
        back_populates="bim_models",
    )
    
    uploaded_by_user: Mapped["User"] = relationship(
        "User",
        back_populates="uploaded_bim_models",
    )


class ConstructionProgress(BaseModel):
    """
    Progress entry with photo registered by users in the field.
    """
    
    __tablename__ = "construction_progress"
    
    construction_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("constructions.id", ondelete="CASCADE"),
        nullable=False,
    )
    bim_reference_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("bim_references.id", ondelete="CASCADE"),
        nullable=False,
    )
    s3_photo_key: Mapped[str] = mapped_column(String(500), nullable=False)
    registered_by: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    deviation_score: Mapped[float | None] = mapped_column(nullable=True)
    
    construction: Mapped["Construction"] = relationship(
        "Construction",
        back_populates="progress_entries",
    )
    
    bim_reference: Mapped["BIMReference"] = relationship(
        "BIMReference",
        back_populates="progress_entries",
    )
    
    registered_by_user: Mapped["User"] = relationship(
        "User",
        back_populates="progress_entries",
    )
    
    deviation_reports: Mapped[list["DeviationReport"]] = relationship(
        "DeviationReport",
        back_populates="progress",
        cascade="all, delete-orphan",
    )


class DeviationReport(BaseModel):
    """
    AI-generated deviation report comparing BIM with progress photos.
    """
    
    __tablename__ = "deviation_reports"
    
    construction_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("constructions.id", ondelete="CASCADE"),
        nullable=False,
    )
    progress_id: Mapped[str | None] = mapped_column(
        String(36),
        ForeignKey("construction_progress.id", ondelete="SET NULL"),
        nullable=True,
    )
    deviation_score: Mapped[float | None] = mapped_column(nullable=True)
    ai_analysis: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    construction: Mapped["Construction"] = relationship(
        "Construction",
        back_populates="deviation_reports",
    )
    
    progress: Mapped["ConstructionProgress | None"] = relationship(
        "ConstructionProgress",
        back_populates="deviation_reports",
    )


