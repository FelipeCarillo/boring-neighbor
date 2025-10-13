#!/usr/bin/env python3

import os
import sys
from datetime import datetime, timedelta
from uuid import uuid4

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from repositories.repository import Repository
from entities.construction import (
    Construction, ConstructionCreate,
    ConstructionPhase, ConstructionPhaseCreate,
    ConstructionProgress, ConstructionProgressCreate,
    ConstructionApproval, ConstructionApprovalCreate
)
from entities.user import User, UserCreate
from helpers.password import hash_password

def seed_database():
    repository = Repository()
    
    phases_data = [
        {"name": "Fundação", "description": "Preparação e execução da fundação", "order": 1, "estimated_duration_days": 30},
        {"name": "Estrutura", "description": "Construção da estrutura principal", "order": 2, "estimated_duration_days": 60},
        {"name": "Acabamento", "description": "Acabamentos internos e externos", "order": 3, "estimated_duration_days": 45},
        {"name": "Instalações", "description": "Instalações elétricas e hidráulicas", "order": 4, "estimated_duration_days": 30},
        {"name": "Testes", "description": "Testes e comissionamento", "order": 5, "estimated_duration_days": 15}
    ]
    
    phases = []
    for phase_data in phases_data:
        phase = ConstructionPhase(
            id=str(uuid4()),
            **phase_data
        )
        phases.append(repository.construction_phase_repo.create_phase(phase))
    
    # Create users with RG and hashed passwords
    users_data = [
        {"rg": "1234567", "password": "admin123", "name": "Administrador", "email": "admin@metrosp.com", "role": "admin"},
        {"rg": "2345678", "password": "super123", "name": "João Silva", "email": "joao@metrosp.com", "role": "supervisor"},
        {"rg": "3456789", "password": "super123", "name": "Maria Santos", "email": "maria@metrosp.com", "role": "supervisor"},
        {"rg": "4567890", "password": "worker123", "name": "Pedro Costa", "email": "pedro@metrosp.com", "role": "worker"},
        {"rg": "5678901", "password": "worker123", "name": "Ana Oliveira", "email": "ana@metrosp.com", "role": "worker"},
    ]
    
    users = []
    for user_data in users_data:
        # Hash password
        password_hash = hash_password(user_data["password"])
        
        # Create user entity
        user = User(
            id=str(uuid4()),
            rg=user_data["rg"],
            password_hash=password_hash,
            name=user_data["name"],
            email=user_data["email"],
            role=user_data["role"],
            is_active=True
        )
        
        # Save to database
        created_user = repository.user_repo.create_user(user)
        users.append(created_user)
    
    constructions_data = [
        {
            "name": "Estação Central - Linha 1",
            "description": "Construção da nova estação central da linha 1 do metrô",
            "location": "Centro, São Paulo",
            "start_date": datetime.utcnow() - timedelta(days=30),
            "end_date": datetime.utcnow() + timedelta(days=90),
            "status": "in_progress",
            "current_phase": "Estrutura",
            "progress_percentage": 45.0,
            "assigned_supervisor_id": users[1].id
        },
        {
            "name": "Túnel Norte - Linha 2",
            "description": "Construção do túnel norte da linha 2",
            "location": "Zona Norte, São Paulo",
            "start_date": datetime.utcnow() - timedelta(days=15),
            "end_date": datetime.utcnow() + timedelta(days=120),
            "status": "in_progress",
            "current_phase": "Fundação",
            "progress_percentage": 20.0,
            "assigned_supervisor_id": users[2].id
        },
        {
            "name": "Estação Terminal - Linha 3",
            "description": "Construção da estação terminal da linha 3",
            "location": "Zona Sul, São Paulo",
            "start_date": datetime.utcnow() + timedelta(days=30),
            "end_date": datetime.utcnow() + timedelta(days=180),
            "status": "planned",
            "current_phase": "Fundação",
            "progress_percentage": 0.0,
            "assigned_supervisor_id": users[1].id
        }
    ]
    
    constructions = []
    for construction_data in constructions_data:
        construction = Construction(
            id=str(uuid4()),
            **construction_data
        )
        constructions.append(repository.construction_repo.create_construction(construction))
    
    for i, construction in enumerate(constructions):
        for j in range(5):
            progress = ConstructionProgress(
                id=str(uuid4()),
                construction_id=construction.id,
                recorded_by=users[3].id,
                progress_percentage=construction.progress_percentage + (j * 5),
                phase=construction.current_phase,
                workers_count=15 + j,
                hours_worked=8.0 + j,
                progress_photos_count=3 + j,
                notes=f"Progresso registrado - dia {j+1}",
                weather_conditions="sunny"
            )
            repository.construction_progress_repo.create_progress(progress)
        
        for user in users[3:]:
            approval = ConstructionApproval(
                id=str(uuid4()),
                construction_id=construction.id,
                user_id=user.id,
                approver_id=users[0].id,
                status="approved",
                can_view=True,
                can_edit=user.role in ["admin", "supervisor"],
                can_delete=user.role == "admin",
                can_approve=user.role == "admin",
                can_manage_users=user.role == "admin"
            )
            repository.construction_approval_repo.create_approval(approval)
    
    print("Database seeded successfully!")
    print(f"Created {len(phases)} phases")
    print(f"Created {len(users)} users")
    print(f"Created {len(constructions)} constructions")
    print(f"Created progress records for each construction")
    print(f"Created approval records for each construction")
    print("\nDefault login credentials:")
    print("Admin: RG=1234567, Password=admin123")
    print("Supervisor: RG=2345678, Password=super123")
    print("Worker: RG=4567890, Password=worker123")

if __name__ == "__main__":
    seed_database()
