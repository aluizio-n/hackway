from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, verify_password
from app.modules.users.models import User
from app.modules.users.repository import UserRepository


class AuthController:
    def __init__(self, db: AsyncSession) -> None:
        self.repo = UserRepository(db)

    async def authenticate(self, email: str, password: str) -> tuple[User, str]:
        invalid = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="E-mail ou senha inválidos")

        user = await self.repo.get_by_email(email)
        if user is None or not verify_password(password, user.password_hash):
            raise invalid

        token = create_access_token(subject=str(user.id))
        return user, token
