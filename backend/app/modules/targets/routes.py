import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.modules.targets.controller import TargetController
from app.modules.targets.models import Target
from app.modules.targets.schemas import PhaseStatusUpdate, TargetCreate, TargetRead, TargetUpdate
from app.modules.users.models import User

router = APIRouter(prefix="/targets", tags=["targets"])


@router.get("", response_model=list[TargetRead])
async def list_targets(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> list[Target]:
    return await TargetController(db).list_targets(current_user.id)


@router.post("", response_model=TargetRead, status_code=201)
async def create_target(
    payload: TargetCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> Target:
    return await TargetController(db).create_target(current_user.id, payload)


@router.get("/{target_id}", response_model=TargetRead)
async def get_target(
    target_id: uuid.UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> Target:
    return await TargetController(db).get_target(target_id, current_user.id)


@router.patch("/{target_id}", response_model=TargetRead)
async def update_target(
    target_id: uuid.UUID,
    payload: TargetUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Target:
    return await TargetController(db).update_target(target_id, current_user.id, payload)


@router.patch("/{target_id}/phase-status", response_model=TargetRead)
async def update_phase_status(
    target_id: uuid.UUID,
    payload: PhaseStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> Target:
    return await TargetController(db).update_phase_status(target_id, current_user.id, payload)


@router.delete("/{target_id}", status_code=204)
async def delete_target(
    target_id: uuid.UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
) -> None:
    await TargetController(db).delete_target(target_id, current_user.id)
