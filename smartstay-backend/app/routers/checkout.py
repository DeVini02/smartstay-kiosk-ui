from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.guest import FaceEmbedding, Guest
from app.models.reservation import Reservation
from app.models.session import CheckoutSession, DigitalKey, Review
from app.schemas.checkout import (
    CheckoutConfirmResponse,
    CheckoutIdentifyRequest,
    CheckoutRateRequest,
    CheckoutRateResponse,
    CheckoutSummaryResponse,
)
from app.services.ids import new_id
from app.services.mappers import reservation_to_response
from app.services.pms import PmsService

router = APIRouter(prefix="/checkout", tags=["checkout"])


def _get_checkout(db: Session, session_id: str) -> CheckoutSession:
    session = (
        db.query(CheckoutSession)
        .options(joinedload(CheckoutSession.reservation), joinedload(CheckoutSession.guest))
        .filter(CheckoutSession.id == session_id)
        .first()
    )
    if not session:
        raise HTTPException(404, "Sessão de check-out não encontrada.")
    return session


@router.post("/identify", response_model=CheckoutSummaryResponse)
def identify_for_checkout(
    body: CheckoutIdentifyRequest,
    db: Session = Depends(get_db),
) -> CheckoutSummaryResponse:
    res: Reservation | None = None

    if body.reservation_id:
        res = (
            db.query(Reservation)
            .options(joinedload(Reservation.guest))
            .filter(Reservation.id == body.reservation_id, Reservation.status == "checked_in")
            .first()
        )
    elif body.face_embedding_id or body.vector_hash:
        embedding_query = db.query(FaceEmbedding)
        if body.face_embedding_id:
            embedding = embedding_query.filter(FaceEmbedding.id == body.face_embedding_id).first()
        else:
            embedding = embedding_query.filter(FaceEmbedding.vector_hash == body.vector_hash).first()
        if embedding:
            res = (
                db.query(Reservation)
                .options(joinedload(Reservation.guest))
                .filter(
                    Reservation.guest_id == embedding.guest_id,
                    Reservation.status == "checked_in",
                )
                .order_by(Reservation.check_in.desc())
                .first()
            )

    if not res:
        raise HTTPException(404, "Não foi possível identificar estadia ativa para check-out.")

    session = CheckoutSession(
        id=new_id("co_"),
        reservation_id=res.id,
        guest_id=res.guest_id,
        kiosk_id=body.kiosk_id,
        status="identified",
        face_verified=bool(body.face_embedding_id or body.vector_hash),
    )
    db.add(session)
    db.commit()

    nights = (res.check_out - res.check_in).days
    extras = [
        {"label": "Frigobar", "amount": 45.0},
        {"label": "Room service", "amount": 89.9},
    ]
    room_rate = 320.0 * max(nights, 1)

    return CheckoutSummaryResponse(
        session_id=session.id,
        reservation=reservation_to_response(res, res.guest),
        guest_name=res.guest_name,
        room=res.room,
        nights=nights,
        extras=extras,
        total_amount=round(room_rate + sum(e["amount"] for e in extras), 2),
    )


@router.get("/{session_id}/summary", response_model=CheckoutSummaryResponse)
def get_checkout_summary(session_id: str, db: Session = Depends(get_db)) -> CheckoutSummaryResponse:
    session = _get_checkout(db, session_id)
    res = session.reservation
    nights = (res.check_out - res.check_in).days
    extras = [{"label": "Frigobar", "amount": 45.0}]
    room_rate = 320.0 * max(nights, 1)
    return CheckoutSummaryResponse(
        session_id=session.id,
        reservation=reservation_to_response(res, session.guest),
        guest_name=res.guest_name,
        room=res.room,
        nights=nights,
        extras=extras,
        total_amount=round(room_rate + sum(e["amount"] for e in extras), 2),
    )


@router.post("/{session_id}/confirm", response_model=CheckoutConfirmResponse)
def confirm_checkout(session_id: str, db: Session = Depends(get_db)) -> CheckoutConfirmResponse:
    session = _get_checkout(db, session_id)
    res = session.reservation
    guest = session.guest

    keys = db.query(DigitalKey).filter(DigitalKey.reservation_id == res.id).all()
    for key in keys:
        key.revoked = True

    session.status = "completed"
    session.completed_at = datetime.now(timezone.utc)
    PmsService.finalize_checkout(db, res, guest)

    return CheckoutConfirmResponse(
        session_id=session.id,
        status="completed",
        message="Check-out concluído. Chaves digitais revogadas.",
    )


@router.post("/{session_id}/rate", response_model=CheckoutRateResponse)
def rate_stay(
    session_id: str,
    body: CheckoutRateRequest,
    db: Session = Depends(get_db),
) -> CheckoutRateResponse:
    session = _get_checkout(db, session_id)
    guest = session.guest

    review = Review(
        checkout_session_id=session.id,
        guest_id=guest.id,
        rating=body.rating,
        comment=body.comment,
    )
    db.add(review)

    past = guest.average_rating or 0
    stays = max(guest.total_stays, 1)
    guest.average_rating = round((past * (stays - 1) + body.rating) / stays, 2)
    db.commit()

    return CheckoutRateResponse(
        session_id=session.id,
        rating=body.rating,
        guest_average_rating=guest.average_rating,
    )
