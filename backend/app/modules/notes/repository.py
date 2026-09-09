import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.notes.models import Note


class NoteRepository:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def list_for_target(self, target_id: uuid.UUID) -> list[Note]:
        result = await self.db.execute(select(Note).where(Note.target_id == target_id))
        return list(result.scalars().all())

    async def get(self, target_id: uuid.UUID, phase_index: int) -> Note | None:
        result = await self.db.execute(
            select(Note).where(Note.target_id == target_id, Note.phase_index == phase_index)
        )
        return result.scalar_one_or_none()

    async def upsert(self, target_id: uuid.UUID, phase_index: int, content: str) -> Note:
        note = await self.get(target_id, phase_index)
        if note is None:
            note = Note(target_id=target_id, phase_index=phase_index, content=content)
            self.db.add(note)
        else:
            note.content = content
        await self.db.commit()
        await self.db.refresh(note)
        return note
