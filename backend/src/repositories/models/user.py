from sqlalchemy import String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING

from src.repositories.models.base import BaseModel
from src.helpers.enums import UserRole

if TYPE_CHECKING:
    from src.repositories.models.construction import Construction, ConstructionProgress, BIMReference, BIMModel, DeviationReport


class User(BaseModel):
    """
    User model representing system users with different roles.
    """
    
    __tablename__ = "users"
    
    registro: Mapped[str] = mapped_column(String(7), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole), nullable=False)
    
    created_constructions: Mapped[list["Construction"]] = relationship(
        "Construction",
        back_populates="created_by_user",
    )
    
    assigned_constructions: Mapped[list["Construction"]] = relationship(
        "Construction",
        secondary="construction_users",
        back_populates="assigned_users",
    )
    
    progress_entries: Mapped[list["ConstructionProgress"]] = relationship(
        "ConstructionProgress",
        back_populates="registered_by_user",
    )
    
    uploaded_bim_references: Mapped[list["BIMReference"]] = relationship(
        "BIMReference",
        back_populates="uploaded_by_user",
    )
    
    uploaded_bim_models: Mapped[list["BIMModel"]] = relationship(
        "BIMModel",
        back_populates="uploaded_by_user",
    )


