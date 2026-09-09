import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import PHASE_COUNT
from app.modules.notes.models import Note
from app.modules.notes.repository import NoteRepository
from app.modules.targets.repository import TargetRepository


class NoteController:
    def __init__(self, db: AsyncSession) -> None:
        self.repo = NoteRepository(db)
        self.target_repo = TargetRepository(db)

    async def _assert_owns_target(self, target_id: uuid.UUID, owner_id: uuid.UUID) -> None:
        target = await self.target_repo.get_for_owner(target_id, owner_id)
        if target is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alvo não encontrado")

    async def list_notes(self, target_id: uuid.UUID, owner_id: uuid.UUID) -> dict[int, Note]:
        await self._assert_owns_target(target_id, owner_id)
        notes = await self.repo.list_for_target(target_id)
        return {n.phase_index: n for n in notes}

    async def upsert_note(self, target_id: uuid.UUID, owner_id: uuid.UUID, phase_index: int, content: str) -> Note:
        await self._assert_owns_target(target_id, owner_id)
        if not 0 <= phase_index < PHASE_COUNT:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Fase inválida")
        return await self.repo.upsert(target_id, phase_index, content)
