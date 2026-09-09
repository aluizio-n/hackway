import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import PHASE_COUNT
from app.modules.targets.models import Target, TargetStatus
from app.modules.targets.repository import TargetRepository
from app.modules.targets.schemas import PhaseStatusUpdate, TargetCreate, TargetUpdate


def _recalc_status(target: Target) -> None:
    pct = target.progress_pct
    if pct == 100:
        target.status = TargetStatus.COMPLETED
    elif pct > 0:
        target.status = TargetStatus.IN_PROGRESS
    else:
        target.status = TargetStatus.NOT_STARTED


class TargetController:
    def __init__(self, db: AsyncSession) -> None:
        self.repo = TargetRepository(db)

    async def list_targets(self, owner_id: uuid.UUID) -> list[Target]:
        return await self.repo.list_for_owner(owner_id)

    async def get_target(self, target_id: uuid.UUID, owner_id: uuid.UUID) -> Target:
        target = await self.repo.get_for_owner(target_id, owner_id)
        if target is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alvo não encontrado")
        return target

    async def create_target(self, owner_id: uuid.UUID, payload: TargetCreate) -> Target:
        target = Target(
            owner_id=owner_id,
            name=payload.name,
            type=payload.type,
            address=payload.address,
            description=payload.description,
            scope_phases=payload.scope_phases,
            phase_status=[0] * PHASE_COUNT,
        )
        _recalc_status(target)
        return await self.repo.create(target)

    async def update_target(self, target_id: uuid.UUID, owner_id: uuid.UUID, payload: TargetUpdate) -> Target:
        target = await self.get_target(target_id, owner_id)
        if payload.name is not None:
            target.name = payload.name
        if payload.address is not None:
            target.address = payload.address
        if payload.description is not None:
            target.description = payload.description
        return await self.repo.save(target)

    async def update_phase_status(
        self, target_id: uuid.UUID, owner_id: uuid.UUID, payload: PhaseStatusUpdate
    ) -> Target:
        target = await self.get_target(target_id, owner_id)
        if not target.scope_phases[payload.phase_index]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Fase fora do escopo do alvo")

        phase_status = list(target.phase_status)
        phase_status[payload.phase_index] = payload.status
        target.phase_status = phase_status
        _recalc_status(target)
        return await self.repo.save(target)

    async def delete_target(self, target_id: uuid.UUID, owner_id: uuid.UUID) -> None:
        target = await self.get_target(target_id, owner_id)
        await self.repo.delete(target)
