from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
import jwt
from cryptography.fernet import Fernet, InvalidToken
from sqlalchemy.types import Text, TypeDecorator

from app.core.config import get_settings

settings = get_settings()

# --- Password hashing -------------------------------------------------------
# Usa a lib bcrypt diretamente (passlib esta sem manutencao e quebra com
# versoes recentes do bcrypt).

_BCRYPT_MAX_BYTES = 72  # limite intrinseco do algoritmo bcrypt


def hash_password(plain_password: str) -> str:
    password_bytes = plain_password.encode("utf-8")[:_BCRYPT_MAX_BYTES]
    return bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, password_hash: str) -> bool:
    password_bytes = plain_password.encode("utf-8")[:_BCRYPT_MAX_BYTES]
    return bcrypt.checkpw(password_bytes, password_hash.encode("utf-8"))


# --- JWT ---------------------------------------------------------------------


def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict[str, Any] | None:
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
    except jwt.PyJWTError:
        return None


# --- Field-level encryption ---------------------------------------------------
# Usado para criptografar dados sensiveis anotados nos alvos (endereco, descricao,
# notas de cada fase do pentest) antes de persistir no banco.

_fernet = Fernet(settings.field_encryption_key.encode())


def encrypt_value(value: str) -> str:
    return _fernet.encrypt(value.encode()).decode()


def decrypt_value(token: str) -> str:
    return _fernet.decrypt(token.encode()).decode()


class EncryptedString(TypeDecorator):
    """Coluna de texto transparente que fica criptografada (Fernet/AES) no banco.

    Usa Text (sem tamanho fixo) porque o texto cifrado (base64 + overhead do
    Fernet) é sempre maior que o texto original.
    """

    impl = Text
    cache_ok = True

    def __init__(self, *args, **kwargs) -> None:
        # O limite de tamanho e validado no Pydantic (texto plano); a coluna
        # em si fica sem limite para acomodar o overhead da criptografia.
        super().__init__()

    def process_bind_param(self, value: str | None, dialect) -> str | None:
        if value is None:
            return None
        return encrypt_value(value)

    def process_result_value(self, value: str | None, dialect) -> str | None:
        if value is None:
            return None
        try:
            return decrypt_value(value)
        except InvalidToken:
            # Dado legado/nao criptografado - evita quebrar leitura.
            return value
