from __future__ import annotations

from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, Date, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.guest import Guest
    from app.models.session import CheckInSession, CheckoutSession, DigitalKey


class Reservation(Base):
    __tablename__ = "reservations"
    __table_args__ = (
        CheckConstraint(
            "status IN ('confirmed', 'checked_in', 'checked_out', 'cancelled')",
            name="ck_reservations_status",
        ),
        CheckConstraint("check_out > check_in", name="ck_reservations_dates"),
        CheckConstraint("floor > 0", name="ck_reservations_floor"),
    )

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    code_suffix: Mapped[str] = mapped_column(String(8), unique=True, index=True)
    guest_id: Mapped[str] = mapped_column(ForeignKey("guests.id"), index=True)
    guest_name: Mapped[str] = mapped_column(String(200), nullable=False)
    room: Mapped[str] = mapped_column(String(16), nullable=False)
    room_type: Mapped[str] = mapped_column(String(64), nullable=False)
    floor: Mapped[int] = mapped_column(Integer, nullable=False)
    wing: Mapped[str] = mapped_column(String(32), nullable=False)
    check_in: Mapped[date] = mapped_column(Date, nullable=False)
    check_out: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="confirmed")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    guest: Mapped[Guest] = relationship(back_populates="reservations")
    check_in_sessions: Mapped[list[CheckInSession]] = relationship(back_populates="reservation")
    checkout_sessions: Mapped[list[CheckoutSession]] = relationship(back_populates="reservation")
    digital_keys: Mapped[list[DigitalKey]] = relationship(back_populates="reservation")
