"""
Camada de integração com PMS (Property Management System).

No MVP, simulamos um PMS interno via banco PostgreSQL.
Em produção, esta camada chamaria APIs de Opera, Cloudbeds, etc.
"""

from sqlalchemy.orm import Session

from app.models.guest import Guest
from app.models.reservation import Reservation


class PmsService:
  @staticmethod
  def sync_reservation_status(db: Session, reservation: Reservation, status: str) -> None:
      reservation.status = status
      db.commit()

  @staticmethod
  def notify_room_ready(db: Session, reservation: Reservation) -> dict:
      return {
          "pms_event": "room_ready",
          "reservation_id": reservation.id,
          "room": reservation.room,
          "message": f"Quarto {reservation.room} liberado no PMS (simulado).",
      }

  @staticmethod
  def finalize_checkout(db: Session, reservation: Reservation, guest: Guest) -> dict:
      reservation.status = "checked_out"
      guest.total_stays = (guest.total_stays or 0) + 1
      db.commit()
      return {
          "pms_event": "checkout_complete",
          "reservation_id": reservation.id,
          "folio_closed": True,
      }
