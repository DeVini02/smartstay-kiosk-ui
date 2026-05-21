from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy import JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.guest import Guest
    from app.models.reservation import Reservation


class CheckInSession(Base):
    __tablename__ = "check_in_sessions"
    __table_args__ = (
        CheckConstraint(
            "status IN ('started', 'consent_given', 'face_verified', 'completed', 'cancelled')",
            name="ck_checkin_sessions_status",
        ),
        CheckConstraint("language IN ('pt', 'en', 'es')", name="ck_checkin_sessions_language"),
    )

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    reservation_id: Mapped[str] = mapped_column(ForeignKey("reservations.id"), index=True)
    guest_id: Mapped[str] = mapped_column(ForeignKey("guests.id"), index=True)
    kiosk_id: Mapped[str] = mapped_column(String(64), nullable=False, default="totem-01")
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="started")
    language: Mapped[str] = mapped_column(String(8), nullable=False, default="pt")
    consents_snapshot: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    face_verified: Mapped[bool] = mapped_column(nullable=False, default=False)
    face_embedding_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    reservation: Mapped[Reservation] = relationship(back_populates="check_in_sessions")
    guest: Mapped[Guest] = relationship()
    digital_key: Mapped[DigitalKey | None] = relationship(back_populates="check_in_session", uselist=False)
    iot_commands: Mapped[list[IoTCommandLog]] = relationship(back_populates="check_in_session")


class DigitalKey(Base):
    __tablename__ = "digital_keys"
    __table_args__ = (
        CheckConstraint("valid_until > valid_from", name="ck_digital_keys_validity"),
    )

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    token: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    reservation_id: Mapped[str] = mapped_column(ForeignKey("reservations.id"), index=True)
    check_in_session_id: Mapped[str] = mapped_column(
        ForeignKey("check_in_sessions.id"), unique=True, index=True
    )
    room: Mapped[str] = mapped_column(String(16), nullable=False)
    qr_payload: Mapped[str] = mapped_column(String(512), nullable=False)
    valid_from: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    valid_until: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked: Mapped[bool] = mapped_column(nullable=False, default=False)

    reservation: Mapped[Reservation] = relationship(back_populates="digital_keys")
    check_in_session: Mapped[CheckInSession] = relationship(back_populates="digital_key")


class IoTCommandLog(Base):
    __tablename__ = "iot_command_logs"
    __table_args__ = (
        CheckConstraint(
            "device IN ('thermostat', 'lighting', 'curtains', 'tv', 'music')",
            name="ck_iot_commands_device",
        ),
        CheckConstraint(
            "status IN ('pending', 'in_progress', 'completed', 'failed')",
            name="ck_iot_commands_status",
        ),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    check_in_session_id: Mapped[str | None] = mapped_column(
        ForeignKey("check_in_sessions.id"), nullable=True, index=True
    )
    guest_id: Mapped[str] = mapped_column(ForeignKey("guests.id"), index=True)
    room: Mapped[str] = mapped_column(String(16), nullable=False)
    device: Mapped[str] = mapped_column(String(32), nullable=False)
    action: Mapped[str] = mapped_column(String(64), nullable=False)
    value: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    check_in_session: Mapped[CheckInSession | None] = relationship(back_populates="iot_commands")


class CheckoutSession(Base):
    __tablename__ = "checkout_sessions"
    __table_args__ = (
        CheckConstraint("status IN ('identified', 'completed')", name="ck_checkout_sessions_status"),
    )

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    reservation_id: Mapped[str] = mapped_column(ForeignKey("reservations.id"), index=True)
    guest_id: Mapped[str] = mapped_column(ForeignKey("guests.id"), index=True)
    kiosk_id: Mapped[str] = mapped_column(String(64), nullable=False, default="totem-01")
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="identified")
    face_verified: Mapped[bool] = mapped_column(nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    reservation: Mapped[Reservation] = relationship(back_populates="checkout_sessions")
    guest: Mapped[Guest] = relationship()
    review: Mapped[Review | None] = relationship(back_populates="checkout_session", uselist=False)


class Review(Base):
    __tablename__ = "reviews"
    __table_args__ = (
        CheckConstraint("rating >= 1.0 AND rating <= 5.0", name="ck_reviews_rating"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    checkout_session_id: Mapped[str] = mapped_column(
        ForeignKey("checkout_sessions.id"), unique=True, index=True
    )
    guest_id: Mapped[str] = mapped_column(ForeignKey("guests.id"), index=True)
    rating: Mapped[float] = mapped_column(Float, nullable=False)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    checkout_session: Mapped[CheckoutSession] = relationship(back_populates="review")
