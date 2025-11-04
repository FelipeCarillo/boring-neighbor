from enum import Enum


class UserRole(str, Enum):
    """
    User role types in the system.
    """
    
    ADMIN = "ADMIN"
    SUPERVISOR = "SUPERVISOR"
    OPERADOR = "OPERADOR"


class ConstructionStatus(str, Enum):
    """
    Construction status types.
    """
    
    PLANNED = "PLANNED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


