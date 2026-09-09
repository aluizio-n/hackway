import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.modules.notes.controller import NoteController
from app.modules.notes.schemas import NoteRead, NoteUpsert
from app.modules.users.models import User

router = APIRouter(prefix="/targets/{target_id}/notes", tags=["notes"])


@router.get("", response_model=dict[int, NoteRead])
async def list_notes(
    target_id: uuid.UUID, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    return await NoteController(db).list_notes(target_id, current_user.id)


@router.put("", response_model=NoteRead)
async def upsert_note(
    target_id: uuid.UUID,
    payload: NoteUpsert,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await NoteController(db).upsert_note(target_id, current_user.id, payload.phase_index, payload.content)
