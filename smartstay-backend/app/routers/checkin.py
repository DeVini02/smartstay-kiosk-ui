from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.guest import ConsentLog, FaceEmbedding, Guest
from app.models.reservation import Reservation
from app.models.session import CheckInSession, DigitalKey
from app.schemas.checkin import (
    CheckInCompleteResponse,
    CheckInSessionResponse,
    CheckInStartRequest,
    CheckInStartResponse,
    ConsentUpdateRequest,
    FaceVerifyRequest,
    FaceVerifyResponse,
)
from app.schemas.common import GuestProfileResponse
from app.services.ids import new_id, new_token
from app.services.iot import apply_guest_preferences
from app.services.mappers import guest_to_profile, reservation_to_response
from app.services.pms import PmsService

router = APIRouter(prefix="/check-in", tags=["check-in"])


def _get_session(db: Session, session_id: str) -> CheckInSession:
    session = (
        db.query(CheckInSession)
        .options(
            joinedload(CheckInSession.reservation).joinedload(Reservation.guest),
            joinedload(CheckInSession.guest).joinedload(Guest.face_embeddings),
        )
        .filter(CheckInSession.id == session_id)
        .first()
    )
    if not session:
        raise HTTPException(404, "Sessão de check-in não encontrada.")
    return session


@router.post("/start", response_model=CheckInStartResponse)
def start_check_in(body: CheckInStartRequest, db: Session = Depends(get_db)) -> CheckInStartResponse:
    res = (
        db.query(Reservation)
        .options(joinedload(Reservation.guest).joinedload(Guest.face_embeddings))
        .filter(Reservation.id == body.reservation_id, Reservation.status == "confirmed")
        .first()
    )
    if not res:
        raise HTTPException(404, "Reserva não encontrada ou já utilizada.")

    session = CheckInSession(
        id=new_id("ci_"),
        reservation_id=res.id,
        guest_id=res.guest_id,
        kiosk_id=body.kiosk_id,
        language=body.language,
        status="started",
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    profile = guest_to_profile(res.guest) if res.guest else None
    return CheckInStartResponse(
        session_id=session.id,
        reservation=reservation_to_response(res, res.guest),
        guest_profile=profile,
    )


@router.get("/{session_id}", response_model=CheckInSessionResponse)
def get_check_in_session(session_id: str, db: Session = Depends(get_db)) -> CheckInSessionResponse:
    session = _get_session(db, session_id)
    guest = session.guest
    return CheckInSessionResponse(
        session_id=session.id,
        status=session.status,
        reservation=reservation_to_response(session.reservation, guest),
        guest_profile=guest_to_profile(guest) if guest else None,
        face_verified=session.face_verified,
        created_at=session.created_at,
    )


@router.post("/{session_id}/consent", response_model=GuestProfileResponse)
def register_consent(
    session_id: str,
    body: ConsentUpdateRequest,
    db: Session = Depends(get_db),
) -> GuestProfileResponse:
    session = _get_session(db, session_id)
    guest = session.guest
    consents = body.consents.model_dump()

    guest.consents = consents
    session.consents_snapshot = consents
    session.status = "consent_given"

    for category, value in consents.items():
        db.add(
            ConsentLog(
                guest_id=guest.id,
                category=category,
                consented=value,
                source="checkin",
            )
        )

    db.commit()
    db.refresh(guest)
    return guest_to_profile(guest)


@router.post("/{session_id}/face", response_model=FaceVerifyResponse)
def verify_face(
    session_id: str,
    body: FaceVerifyRequest,
    db: Session = Depends(get_db),
) -> FaceVerifyResponse:
    session = _get_session(db, session_id)
    guest = session.guest

    embedding: FaceEmbedding | None = None
    if body.face_embedding_id:
        embedding = (
            db.query(FaceEmbedding)
            .filter(FaceEmbedding.id == body.face_embedding_id, FaceEmbedding.is_active.is_(True))
            .first()
        )
    elif body.vector_hash:
        embedding = (
            db.query(FaceEmbedding)
            .filter(FaceEmbedding.vector_hash == body.vector_hash, FaceEmbedding.is_active.is_(True))
            .first()
        )
    elif body.simulate_match:
        embedding = (
            db.query(FaceEmbedding)
            .filter(FaceEmbedding.guest_id == guest.id, FaceEmbedding.is_active.is_(True))
            .first()
        )

    verified = embedding is not None and embedding.guest_id == guest.id
    if verified and embedding:
        session.face_verified = True
        session.face_embedding_id = embedding.id
        session.status = "face_verified"
        db.commit()

    is_returning = guest.total_stays > 1
    return FaceVerifyResponse(
        verified=verified,
        guest_id=guest.id if verified else None,
        face_embedding_id=embedding.id if embedding and verified else None,
        is_returning_guest=is_returning and verified,
    )


@router.post("/{session_id}/complete", response_model=CheckInCompleteResponse)
async def complete_check_in(
    session_id: str,
    db: Session = Depends(get_db),
) -> CheckInCompleteResponse:
    session = _get_session(db, session_id)
    if session.status not in ("consent_given", "face_verified", "started"):
        pass  # permite completar após consent mesmo sem face no MVP

    res = session.reservation
    guest = session.guest

    token = new_token()
    qr_payload = f"smartstay://room/{res.room}/checkin/{token}"
    valid_until = datetime.now(timezone.utc) + timedelta(days=(res.check_out - res.check_in).days + 1)

    digital_key = DigitalKey(
        id=new_id("dk_"),
        token=token,
        reservation_id=res.id,
        check_in_session_id=session.id,
        room=res.room,
        qr_payload=qr_payload,
        valid_until=valid_until,
    )
    db.add(digital_key)

    session.status = "completed"
    session.completed_at = datetime.now(timezone.utc)
    res.status = "checked_in"
    PmsService.sync_reservation_status(db, res, "checked_in")
    PmsService.notify_room_ready(db, res)

    consents = guest.consents or {}
    apply_personalization = bool(consents.get("comfort") or consents.get("stay"))
    iot_commands = []
    if apply_personalization and guest.total_stays > 0:
        iot_commands = await apply_guest_preferences(db, guest, res.room, session.id)

    db.commit()

    return CheckInCompleteResponse(
        session_id=session.id,
        digital_key_token=token,
        qr_payload=qr_payload,
        room=res.room,
        guest_name=res.guest_name,
        wifi_ssid=f"SmartStay-{res.room}",
        wifi_password=f"STAY{res.room}",
        iot_commands=iot_commands,
        apply_personalization=apply_personalization,
    )
