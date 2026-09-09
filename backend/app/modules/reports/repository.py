import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.notes.repository import NoteRepository
from app.modules.targets.models import Target
from app.modules.targets.repository import TargetRepository


class ReportRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.target_repo = TargetRepository(db)
        self.note_repo = NoteRepository(db)

    async def get_target_for_owner(self, target_id: uuid.UUID, owner_id: uuid.UUID) -> Target | None:
        return await self.target_repo.get_for_owner(target_id, owner_id)

    async def get_notes_by_phase(self, target_id: uuid.UUID) -> dict[int, str]:
        notes = await self.note_repo.list_for_target(target_id)
        return {n.phase_index: n.content for n in notes if n.content.strip()}
