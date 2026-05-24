from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.guest import ConsentLog, FaceEmbedding, Guest
from app.models.reservation import Reservation
from app.schemas.common import GuestProfileResponse, MessageResponse
from app.schemas.guest import ConsentLogEntry, ConsentUpdateItem, LgpdExportResponse, PreferencesPatchRequest
from app.security import require_kiosk_auth
from app.services.mappers import guest_to_profile

router = APIRouter(
    prefix="/guests",
    tags=["guests"],
    dependencies=[Depends(require_kiosk_auth)],
)


def _get_guest(db: Session, guest_id: str) -> Guest:
    guest = (
        db.query(Guest)
        .options(joinedload(Guest.face_embeddings))
        .filter(Guest.id == guest_id)
        .first()
    )
    if not guest:
        raise HTTPException(404, "Hóspede não encontrado.")
    return guest


@router.get("/{guest_id}/profile", response_model=GuestProfileResponse)
def get_profile(guest_id: str, db: Session = Depends(get_db)) -> GuestProfileResponse:
    return guest_to_profile(_get_guest(db, guest_id))


@router.patch("/{guest_id}/preferences", response_model=GuestProfileResponse)
def update_preferences(
    guest_id: str,
    body: PreferencesPatchRequest,
    db: Session = Depends(get_db),
) -> GuestProfileResponse:
    guest = _get_guest(db, guest_id)
    prefs = dict(guest.preferences or {})
    prefs[body.category] = {**(prefs.get(body.category) or {}), **body.data}
    guest.preferences = prefs
    db.commit()
    db.refresh(guest)
    return guest_to_profile(guest)


@router.post("/{guest_id}/consents", response_model=GuestProfileResponse)
def update_consents(
    guest_id: str,
    items: list[ConsentUpdateItem],
    db: Session = Depends(get_db),
) -> GuestProfileResponse:
    guest = _get_guest(db, guest_id)
    consents = dict(guest.consents or {})
    for item in items:
        consents[item.category] = item.consented
        db.add(
            ConsentLog(
                guest_id=guest.id,
                category=item.category,
                consented=item.consented,
                source=item.source,
            )
        )
    guest.consents = consents
    db.commit()
    db.refresh(guest)
    return guest_to_profile(guest)


@router.get("/{guest_id}/consent-history", response_model=list[ConsentLogEntry])
def consent_history(guest_id: str, db: Session = Depends(get_db)) -> list[ConsentLogEntry]:
    _get_guest(db, guest_id)
    logs = (
        db.query(ConsentLog)
        .filter(ConsentLog.guest_id == guest_id)
        .order_by(ConsentLog.created_at.desc())
        .limit(100)
        .all()
    )
    return [ConsentLogEntry.model_validate(log) for log in logs]


@router.get("/{guest_id}/export", response_model=LgpdExportResponse)
def export_guest_data(guest_id: str, db: Session = Depends(get_db)) -> LgpdExportResponse:
    guest = _get_guest(db, guest_id)
    logs = db.query(ConsentLog).filter(ConsentLog.guest_id == guest_id).all()
    reservations = db.query(Reservation).filter(Reservation.guest_id == guest_id).all()

    return LgpdExportResponse(
        guest=guest_to_profile(guest),
        consent_history=[ConsentLogEntry.model_validate(l) for l in logs],
        reservations=[
            {
                "id": r.id,
                "room": r.room,
                "check_in": r.check_in.isoformat(),
                "check_out": r.check_out.isoformat(),
                "status": r.status,
            }
            for r in reservations
        ],
        exported_at=datetime.now(timezone.utc),
    )


@router.delete("/{guest_id}/data", response_model=MessageResponse)
def delete_guest_data(guest_id: str, db: Session = Depends(get_db)) -> MessageResponse:
    guest = _get_guest(db, guest_id)
    db.query(ConsentLog).filter(ConsentLog.guest_id == guest_id).delete()
    db.query(FaceEmbedding).filter(FaceEmbedding.guest_id == guest_id).delete()
    guest.preferences = {}
    guest.consents = {"comfort": False, "stay": False, "consumption": False}
    db.commit()
    return MessageResponse(
        message="Dados pessoais e embeddings removidos conforme LGPD. Reservas históricas mantidas anonimizadas no PMS."
    )
