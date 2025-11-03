from datetime import date
from typing import Optional
from sqlalchemy.orm import Session

from src.repositories.models.construction import ConstructionPhase
from src.repositories.repositories.construction_phase_repo.construction_phase_repo_interface import ConstructionPhaseRepositoryInterface
from src.helpers.enums import PhaseStatus


class ConstructionPhaseRepository(ConstructionPhaseRepositoryInterface):
    """
    SQLAlchemy implementation of ConstructionPhase repository.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create(
        self,
        construction_id: str,
        phase_name: str,
        order: int,
        status: PhaseStatus = PhaseStatus.PENDING,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> ConstructionPhase:
        """
        Create a new construction phase.
        """
        phase = ConstructionPhase(
            construction_id=construction_id,
            phase_name=phase_name,
            status=status,
            start_date=start_date,
            end_date=end_date,
            order=order,
        )
        self.db.add(phase)
        self.db.commit()
        self.db.refresh(phase)
        return phase
    
    def get_by_id(self, phase_id: str) -> Optional[ConstructionPhase]:
        """
        Get phase by ID.
        """
        return self.db.query(ConstructionPhase).filter(
            ConstructionPhase.id == phase_id,
            ConstructionPhase.deleted_at.is_(None),
        ).first()
    
    def list_by_construction(self, construction_id: str) -> list[ConstructionPhase]:
        """
        List all phases for a construction, ordered by order field.
        """
        return self.db.query(ConstructionPhase).filter(
            ConstructionPhase.construction_id == construction_id,
            ConstructionPhase.deleted_at.is_(None),
        ).order_by(ConstructionPhase.order).all()
    
    def update(self, phase_id: str, **kwargs) -> Optional[ConstructionPhase]:
        """
        Update phase fields.
        """
        phase = self.get_by_id(phase_id)
        if not phase:
            return None
        
        for key, value in kwargs.items():
            if hasattr(phase, key) and value is not None:
                setattr(phase, key, value)
        
        self.db.commit()
        self.db.refresh(phase)
        return phase
    
    def delete(self, phase_id: str) -> bool:
        """
        Delete a phase (hard delete since it's cascade deleted with construction).
        """
        phase = self.get_by_id(phase_id)
        if not phase:
            return False
        
        self.db.delete(phase)
        self.db.commit()
        return True


