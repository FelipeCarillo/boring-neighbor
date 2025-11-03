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


class PhaseStatus(str, Enum):
    """
    Construction phase status types.
    """
    
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"


class StandardPhase(str, Enum):
    """
    Standard construction phases for Metro SP projects.
    """
    
    FUNDACAO = "Fundação"
    ESTRUTURA = "Estrutura"
    ALVENARIA = "Alvenaria"
    INSTALACOES = "Instalações"
    ACABAMENTO = "Acabamento"
    FINALIZACAO = "Finalização"


