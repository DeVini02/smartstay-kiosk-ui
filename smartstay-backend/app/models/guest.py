from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, CheckConstraint, Date, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy import JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.reservation import Reservation
    from app.models.session import CheckInSession, CheckoutSession


class Guest(Base):
    __tablename__ = "guests"
    __table_args__ = (
        CheckConstraint("total_stays >= 0", name="ck_guests_total_stays"),
        CheckConstraint("average_rating >= 0.0 AND average_rating <= 5.0", name="ck_guests_average_rating"),
    )

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    document: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    member_since: Mapped[date] = mapped_column(Date, nullable=False)
    total_stays: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    average_rating: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    preferences: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    consents: Mapped[dict] = mapped_column(
        JSON,
        nullable=False,
        default=lambda: {"comfort": False, "stay": False, "consumption": False},
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    face_embeddings: Mapped[list[FaceEmbedding]] = relationship(back_populates="guest", cascade="all, delete-orphan")
    reservations: Mapped[list[Reservation]] = relationship(back_populates="guest")
    consent_logs: Mapped[list[ConsentLog]] = relationship(back_populates="guest", cascade="all, delete-orphan")


class FaceEmbedding(Base):
    """Referência ao embedding facial — nunca armazenamos foto no servidor (LGPD)."""

    __tablename__ = "face_embeddings"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    guest_id: Mapped[str] = mapped_column(ForeignKey("guests.id", ondelete="CASCADE"), index=True)
    vector_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    guest: Mapped[Guest] = relationship(back_populates="face_embeddings")


class ConsentLog(Base):
    __tablename__ = "consent_logs"
    __table_args__ = (
        CheckConstraint("category IN ('comfort', 'stay', 'consumption')", name="ck_consent_logs_category"),
        CheckConstraint("source IN ('checkin', 'profile_edit', 'onboarding')", name="ck_consent_logs_source"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    guest_id: Mapped[str] = mapped_column(ForeignKey("guests.id", ondelete="CASCADE"), index=True)
    category: Mapped[str] = mapped_column(String(32), nullable=False)
    consented: Mapped[bool] = mapped_column(Boolean, nullable=False)
    source: Mapped[str] = mapped_column(String(32), nullable=False)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    guest: Mapped[Guest] = relationship(back_populates="consent_logs")
