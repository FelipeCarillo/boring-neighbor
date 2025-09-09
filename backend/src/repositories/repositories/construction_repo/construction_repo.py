from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session

from repositories.models.construction import Construction
from .construction_repo_interface import IConstructionRepo


class ConstructionRepo(IConstructionRepo):

    def __init__(self, session: Session):
        self.session = session

    def get_construction_by_id(self, id: str) -> Optional[Construction]:
        return self.session.query(Construction).filter(Construction.id == id).first()

    def create_construction(self, construction: Construction) -> Construction:
        self.session.add(construction)
        self.session.commit()
        return construction

    def update_construction(self, construction: Construction) -> Construction:
        self.session.commit()
        return construction

    def delete_construction(self, id: str) -> None:
        construction = self.get_construction_by_id(id)
        if construction:
            self.session.delete(construction)
            self.session.commit()

    def list_constructions(self) -> List[Construction]:
        return self.session.query(Construction).all()

    def get_constructions_by_supervisor(self, supervisor_id: str) -> List[Construction]:
        return self.session.query(Construction).filter(Construction.assigned_supervisor_id == supervisor_id).all()

    def get_constructions_by_status(self, status: str) -> List[Construction]:
        return self.session.query(Construction).filter(Construction.status == status).all()

    def get_constructions_by_phase(self, phase: str) -> List[Construction]:
        return self.session.query(Construction).filter(Construction.current_phase == phase).all()

    def search_constructions_by_name(self, name: str) -> List[Construction]:
        return self.session.query(Construction).filter(Construction.name.ilike(f"%{name}%")).all()

    def get_constructions_by_date_range(self, start_date: datetime, end_date: datetime) -> List[Construction]:
        return self.session.query(Construction).filter(
            Construction.start_date >= start_date,
            Construction.end_date <= end_date
        ).all()
