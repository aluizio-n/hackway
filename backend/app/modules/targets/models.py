import enum
import uuid
from datetime import datetime

from sqlalchemy import ARRAY, Boolean, DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.constants import PHASE_COUNT, TARGET_TYPE_KEYS
from app.core.database import Base
from app.core.security import EncryptedString


class TargetStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class Target(Base):
    __tablename__ = "targets"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    type: Mapped[str] = mapped_column(Enum(*TARGET_TYPE_KEYS, name="target_type"), nullable=False)

    # Dados sensiveis do alvo - criptografados em repouso (Fernet).
    address: Mapped[str] = mapped_column(EncryptedString(), nullable=False)
    description: Mapped[str | None] = mapped_column(EncryptedString(), nullable=True)

    status: Mapped[TargetStatus] = mapped_column(
        Enum(TargetStatus, name="target_status", values_callable=lambda enum_cls: [e.value for e in enum_cls]),
        default=TargetStatus.NOT_STARTED,
        nullable=False,
    )
    scope_phases: Mapped[list[bool]] = mapped_column(ARRAY(Boolean), nullable=False)
    phase_status: Mapped[list[int]] = mapped_column(
        ARRAY(Integer), nullable=False, default=lambda: [0] * PHASE_COUNT
    )

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    owner: Mapped["User"] = relationship(back_populates="targets")
    notes: Mapped[list["Note"]] = relationship(back_populates="target", cascade="all, delete-orphan")

    @property
    def progress_pct(self) -> int:
        scoped_done = [i for i, on in enumerate(self.scope_phases) if on and self.phase_status[i] == 2]
        scoped_total = [i for i, on in enumerate(self.scope_phases) if on]
        if not scoped_total:
            return 0
        return round((len(scoped_done) / len(scoped_total)) * 100)
