from app.models.guest import Guest
from app.models.reservation import Reservation
from app.schemas.common import (
    ConsumptionPrefs,
    ComfortPrefs,
    GuestConsents,
    GuestPreferences,
    GuestProfileResponse,
    ReservationResponse,
    StayPrefs,
)


def reservation_to_response(res: Reservation, guest: Guest | None = None) -> ReservationResponse:
    is_returning = (guest.total_stays if guest else 0) > 1
    return ReservationResponse(
        id=res.id,
        code=f"RES-2026-{res.code_suffix}",
        guest_name=res.guest_name,
        room=res.room,
        room_type=res.room_type,
        check_in=res.check_in,
        check_out=res.check_out,
        floor=res.floor,
        wing=res.wing,
        status=res.status,
        guest_id=res.guest_id,
        is_returning_guest=is_returning,
    )


def guest_to_profile(guest: Guest, face_embedding_id: str | None = None) -> GuestProfileResponse:
    prefs_raw = guest.preferences or {}
    consents_raw = guest.consents or {}

    comfort = prefs_raw.get("comfort")
    stay = prefs_raw.get("stay")
    consumption = prefs_raw.get("consumption")

    active_face = face_embedding_id
    if not active_face and guest.face_embeddings:
        active = next((f for f in guest.face_embeddings if f.is_active), None)
        active_face = active.id if active else None

    return GuestProfileResponse(
        guest_id=guest.id,
        face_embedding_id=active_face,
        member_since=guest.member_since,
        total_stays=guest.total_stays,
        average_rating=guest.average_rating,
        consents=GuestConsents(
            comfort=bool(consents_raw.get("comfort")),
            stay=bool(consents_raw.get("stay")),
            consumption=bool(consents_raw.get("consumption")),
        ),
        preferences=GuestPreferences(
            comfort=ComfortPrefs(**comfort) if comfort else None,
            stay=StayPrefs(**stay) if stay else None,
            consumption=ConsumptionPrefs(**consumption) if consumption else None,
        ),
    )
