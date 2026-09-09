from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.modules.reports.controller import ReportController
from app.modules.reports.schemas import ReportOut, ReportRequest
from app.modules.users.models import User

router = APIRouter(prefix="/reports", tags=["reports"])


@router.post("/generate", response_model=ReportOut)
async def generate_report(
    payload: ReportRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    return await ReportController(db).generate(payload.target_id, current_user.id, payload.report_type)
