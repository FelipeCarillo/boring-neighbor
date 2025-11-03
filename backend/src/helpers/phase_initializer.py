from sqlalchemy.orm import Session

from src.repositories.repositories.construction_phase_repo.construction_phase_repo import ConstructionPhaseRepository
from src.helpers.enums import StandardPhase, PhaseStatus


def initialize_standard_phases(construction_id: str, db: Session) -> None:
    """
    Initialize standard construction phases for a new construction.
    Creates the 6 standard phases in order.
    """
    phase_repo = ConstructionPhaseRepository(db)
    
    standard_phases = [
        (StandardPhase.FUNDACAO, 1),
        (StandardPhase.ESTRUTURA, 2),
        (StandardPhase.ALVENARIA, 3),
        (StandardPhase.INSTALACOES, 4),
        (StandardPhase.ACABAMENTO, 5),
        (StandardPhase.FINALIZACAO, 6),
    ]
    
    for phase_name, order in standard_phases:
        phase_repo.create(
            construction_id=construction_id,
            phase_name=phase_name.value,
            order=order,
            status=PhaseStatus.PENDING,
        )


