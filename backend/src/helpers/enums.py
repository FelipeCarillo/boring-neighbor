from enum import Enum


class STAGE(str, Enum):
    """Enum for stages."""
    LOCAL = "local"
    DEV = "dev"
    UAT = "uat"
    PROD = "prod"

    def is_local(self) -> bool:
        return self == STAGE.LOCAL


class ConstructionPhase(str, Enum):
    """Enum for construction phases."""
    PLANNING = "planning"
    FOUNDATION = "foundation"
    STRUCTURE = "structure"
    FINISHING = "finishing"
    INSPECTION = "inspection"
    COMPLETED = "completed"


class ConstructionStatus(str, Enum):
    """Enum for construction status."""
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class ApprovalStatus(str, Enum):
    """Enum for approval status."""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class UserPermission(str, Enum):
    """Enum for user permissions on constructions."""
    VIEW = "view"
    EDIT = "edit"
    DELETE = "delete"
    APPROVE = "approve"
    MANAGE_USERS = "manage_users"
