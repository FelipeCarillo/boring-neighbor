"""
SQLAlchemy models package.

This module imports all models to ensure they are loaded when SQLAlchemy
needs to resolve relationships.
"""
from sqlalchemy.orm import configure_mappers

from src.repositories.models.base import Base, BaseModel
from src.repositories.models.user import User
from src.repositories.models.construction import (
    Construction,
    BIMReference,
    BIMModel,
    ConstructionProgress,
    DeviationReport,
)

# Configure all mappers to resolve relationships
# This must be called after all models are imported
configure_mappers()

__all__ = [
    "Base",
    "BaseModel",
    "User",
    "Construction",
    "BIMReference",
    "BIMModel",
    "ConstructionProgress",
    "DeviationReport",
]

