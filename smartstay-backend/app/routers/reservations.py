import re

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.guest import Guest
from app.models.reservation import Reservation
from app.schemas.common import ReservationResponse
from app.services.mappers import guest_to_profile, reservation_to_response

router = APIRouter(prefix="/reservations", tags=["reservations"])


def _normalize_document(doc: str) -> str:
    return re.sub(r"\D", "", doc)


@router.get("/lookup", response_model=ReservationResponse)
def lookup_reservation(
    code: str | None = Query(None, min_length=4, max_length=4),
    document: str | None = Query(None, min_length=11, max_length=14),
    db: Session = Depends(get_db),
) -> ReservationResponse:
    if not code and not document:
        raise HTTPException(400, "Informe code (4 dígitos) ou document (CPF).")

    query = db.query(Reservation).options(joinedload(Reservation.guest))

    if code:
        res = query.filter(Reservation.code_suffix == code).first()
    else:
        doc = _normalize_document(document or "")
        guest = db.query(Guest).filter(Guest.document == doc).first()
        if not guest:
            raise HTTPException(404, "Reserva não encontrada.")
        res = (
            query.filter(Reservation.guest_id == guest.id, Reservation.status == "confirmed")
            .order_by(Reservation.check_in.desc())
            .first()
        )

    if not res:
        raise HTTPException(404, "Reserva não encontrada.")

    return reservation_to_response(res, res.guest)


@router.get("/{reservation_id}", response_model=ReservationResponse)
def get_reservation(reservation_id: str, db: Session = Depends(get_db)) -> ReservationResponse:
    res = (
        db.query(Reservation)
        .options(joinedload(Reservation.guest))
        .filter(Reservation.id == reservation_id)
        .first()
    )
    if not res:
        raise HTTPException(404, "Reserva não encontrada.")
    return reservation_to_response(res, res.guest)
