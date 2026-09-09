import uuid

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.database import get_db
from app.core.security import decode_access_token
from app.modules.users.models import User
from app.modules.users.repository import UserRepository

settings = get_settings()


def _extract_token(request: Request) -> str | None:
    token = request.cookies.get(settings.auth_cookie_name)
    if token:
        return token
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.lower().startswith("bearer "):
        return auth_header.split(" ", 1)[1]
    return None


async def get_current_user(request: Request, db: AsyncSession = Depends(get_db)) -> User:
    unauthorized = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Não autenticado")

    token = _extract_token(request)
    if not token:
        raise unauthorized

    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise unauthorized

    try:
        user_id = uuid.UUID(payload["sub"])
    except ValueError as exc:
        raise unauthorized from exc

    user = await UserRepository(db).get_by_id(user_id)
    if user is None:
        raise unauthorized

    return user
