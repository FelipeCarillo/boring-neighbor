from fastapi import APIRouter, Depends, Query, UploadFile, File, Form
from typing import Optional, List
from datetime import datetime

from helpers.auth import get_user
from helpers.errors import handle_exception
from entities import User
from entities.construction import (
    Construction, ConstructionCreate, ConstructionUpdate,
    ConstructionProgress, ConstructionProgressCreate, ConstructionProgressUpdate,
    ConstructionPhase, ConstructionPhaseCreate, ConstructionPhaseUpdate,
    ConstructionApproval, ConstructionApprovalCreate, ConstructionApprovalUpdate
)
from repositories.models.construction import Construction3DReport
from .controller import ConstructionController
from .service import ConstructionService
from repositories.repository import Repository
from infra.s3_manager import S3Manager

construction_router = APIRouter(
    prefix="/constructions",
    tags=["Constructions"],
)

phases_router = APIRouter(
    prefix="/phases",
    tags=["Construction Phases"],
)

approvals_router = APIRouter(
    prefix="/approvals",
    tags=["Construction Approvals"],
)

progress_router = APIRouter(
    prefix="/progress",
    tags=["Construction Progress"],
)

def get_repository() -> Repository:
    return Repository()

def get_s3_manager() -> S3Manager:
    return S3Manager()

def get_construction_service(repository: Repository = Depends(get_repository)) -> ConstructionService:
    return ConstructionService(repository)

def get_construction_controller(service: ConstructionService = Depends(get_construction_service)) -> ConstructionController:
    return ConstructionController(service)

@handle_exception
@construction_router.post("/", response_model=Construction)
def create_construction(
    construction_data: ConstructionCreate,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    return controller.create_construction(construction_data, user.id)

@handle_exception
@construction_router.get("/", response_model=List[Construction])
def list_constructions(
    status: Optional[str] = Query(None),
    supervisor_id: Optional[str] = Query(None),
    phase: Optional[str] = Query(None),
    name: Optional[str] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    filters = {}
    if status:
        filters['status'] = status
    if supervisor_id:
        filters['supervisor_id'] = supervisor_id
    if phase:
        filters['phase'] = phase
    if name:
        filters['name'] = name
    if start_date and end_date:
        filters['start_date'] = start_date
        filters['end_date'] = end_date
    
    return controller.list_constructions(filters if filters else None)

@handle_exception
@construction_router.get("/{construction_id}", response_model=Construction)
def get_construction(
    construction_id: str,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    return controller.get_construction(construction_id)

@handle_exception
@construction_router.put("/{construction_id}", response_model=Construction)
def update_construction(
    construction_id: str,
    construction_data: ConstructionUpdate,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    return controller.update_construction(construction_id, construction_data)

@handle_exception
@construction_router.delete("/{construction_id}")
def delete_construction(
    construction_id: str,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    return controller.delete_construction(construction_id)

@handle_exception
@construction_router.post("/{construction_id}/progress", response_model=ConstructionProgress)
def create_progress(
    construction_id: str,
    progress_data: ConstructionProgressCreate,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    progress_data.construction_id = construction_id
    return controller.create_progress(progress_data, user.id)

@handle_exception
@construction_router.get("/{construction_id}/progress", response_model=List[ConstructionProgress])
def list_progress_by_construction(
    construction_id: str,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    return controller.list_progress_by_construction(construction_id)

@handle_exception
@construction_router.get("/{construction_id}/progress/latest", response_model=ConstructionProgress)
def get_latest_progress(
    construction_id: str,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    progress = controller.get_latest_progress(construction_id)
    if not progress:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No progress records found for this construction"
        )
    return progress

@handle_exception
@progress_router.put("/{progress_id}", response_model=ConstructionProgress)
def update_progress(
    progress_id: str,
    progress_data: ConstructionProgressUpdate,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    return controller.update_progress(progress_id, progress_data)

@handle_exception
@progress_router.delete("/{progress_id}")
def delete_progress(
    progress_id: str,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    return controller.delete_progress(progress_id)

@handle_exception
@phases_router.post("/", response_model=ConstructionPhase)
def create_phase(
    phase_data: ConstructionPhaseCreate,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    return controller.create_phase(phase_data)

@handle_exception
@phases_router.get("/", response_model=List[ConstructionPhase])
def list_phases(
    active_only: bool = Query(False),
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    if active_only:
        return controller.list_active_phases()
    return controller.list_phases()

@handle_exception
@phases_router.get("/{phase_id}", response_model=ConstructionPhase)
def get_phase(
    phase_id: str,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    return controller.get_phase(phase_id)

@handle_exception
@phases_router.put("/{phase_id}", response_model=ConstructionPhase)
def update_phase(
    phase_id: str,
    phase_data: ConstructionPhaseUpdate,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    return controller.update_phase(phase_id, phase_data)

@handle_exception
@phases_router.delete("/{phase_id}")
def delete_phase(
    phase_id: str,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    return controller.delete_phase(phase_id)

@handle_exception
@construction_router.post("/{construction_id}/approvals", response_model=ConstructionApproval)
def create_approval(
    construction_id: str,
    approval_data: ConstructionApprovalCreate,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    approval_data.construction_id = construction_id
    return controller.create_approval(approval_data, user.id)

@handle_exception
@construction_router.get("/{construction_id}/approvals", response_model=List[ConstructionApproval])
def list_approvals_by_construction(
    construction_id: str,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    return controller.list_approvals_by_construction(construction_id)

@handle_exception
@approvals_router.get("/user/{user_id}", response_model=List[ConstructionApproval])
def list_approvals_by_user(
    user_id: str,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    return controller.list_approvals_by_user(user_id)

@handle_exception
@approvals_router.get("/{approval_id}", response_model=ConstructionApproval)
def get_approval(
    approval_id: str,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    return controller.get_approval(approval_id)

@handle_exception
@approvals_router.put("/{approval_id}", response_model=ConstructionApproval)
def update_approval(
    approval_id: str,
    approval_data: ConstructionApprovalUpdate,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    return controller.update_approval(approval_id, approval_data)

@handle_exception
@approvals_router.delete("/{approval_id}")
def delete_approval(
    approval_id: str,
    user: User = Depends(get_user),
    controller: ConstructionController = Depends(get_construction_controller)
):
    return controller.delete_approval(approval_id)

@handle_exception
@construction_router.post("/{construction_id}/3d/upload")
def upload_3d_files(
    construction_id: str,
    ply_file: UploadFile = File(...),
    obj_file: UploadFile = File(...),
    user: User = Depends(get_user),
    s3_manager: S3Manager = Depends(get_s3_manager)
):
    from datetime import datetime
    from uuid import uuid4
    
    if not ply_file.filename.endswith('.ply'):
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="PLY file must have .ply extension"
        )
    
    if not obj_file.filename.endswith('.obj'):
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OBJ file must have .obj extension"
        )
    
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    ply_key = f"constructions/{construction_id}/3d/{timestamp}_{ply_file.filename}"
    obj_key = f"constructions/{construction_id}/3d/{timestamp}_{obj_file.filename}"
    
    s3_manager.upload_file_stream(ply_file.file, ply_key, "application/octet-stream")
    s3_manager.upload_file_stream(obj_file.file, obj_key, "application/octet-stream")
    
    return {
        "message": "Files uploaded successfully",
        "ply_key": ply_key,
        "obj_key": obj_key
    }

@handle_exception
@construction_router.post("/{construction_id}/3d/process")
def process_3d_files(
    construction_id: str,
    ply_key: str = Form(...),
    obj_key: str = Form(...),
    user: User = Depends(get_user),
    repository: Repository = Depends(get_repository),
    s3_manager: S3Manager = Depends(get_s3_manager)
):
    from services.point_cloud_service import PointCloudService
    from uuid import uuid4
    
    point_cloud_service = PointCloudService(repository, s3_manager)
    
    report = Construction3DReport(
        id=str(uuid4()),
        construction_id=construction_id,
        s3_ply_key=ply_key,
        s3_obj_key=obj_key,
        status='pending'
    )
    
    repository.construction_3d_report_repo.create_report(report)
    
    import asyncio
    asyncio.create_task(point_cloud_service.process_construction_3d(construction_id, ply_key, obj_key))
    
    return {
        "message": "3D processing started",
        "report_id": report.id
    }

@handle_exception
@construction_router.get("/{construction_id}/3d/status")
def get_3d_status(
    construction_id: str,
    user: User = Depends(get_user),
    repository: Repository = Depends(get_repository)
):
    report = repository.construction_3d_report_repo.get_latest_report_by_construction(construction_id)
    if not report:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No 3D report found for this construction"
        )
    
    return {
        "status": report.status,
        "processing_started_at": report.processing_started_at,
        "processing_completed_at": report.processing_completed_at,
        "error_message": report.error_message
    }

@handle_exception
@construction_router.get("/{construction_id}/3d/report")
def get_3d_report(
    construction_id: str,
    user: User = Depends(get_user),
    repository: Repository = Depends(get_repository)
):
    report = repository.construction_3d_report_repo.get_latest_report_by_construction(construction_id)
    if not report:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No 3D report found for this construction"
        )
    
    if report.status != 'completed':
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Report is not completed. Current status: {report.status}"
        )
    
    import json
    return json.loads(report.report_json)

@handle_exception
@construction_router.get("/{construction_id}/3d/download/{file_type}")
def get_3d_download_url(
    construction_id: str,
    file_type: str,
    user: User = Depends(get_user),
    repository: Repository = Depends(get_repository),
    s3_manager: S3Manager = Depends(get_s3_manager)
):
    if file_type not in ['ply', 'obj', 'report']:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File type must be 'ply', 'obj', or 'report'"
        )
    
    report = repository.construction_3d_report_repo.get_latest_report_by_construction(construction_id)
    if not report:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No 3D report found for this construction"
        )
    
    if file_type == 'ply':
        key = report.s3_ply_key
    elif file_type == 'obj':
        key = report.s3_obj_key
    else:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Report download not implemented yet"
        )
    
    url = s3_manager.get_presigned_url(key)
    return {"download_url": url}
