from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.session import DigitalKey
from app.security import require_kiosk_auth
from pydantic import BaseModel

router = APIRouter(
    prefix="/keys",
    tags=["digital-keys"],
    dependencies=[Depends(require_kiosk_auth)],
)


class KeyValidationResponse(BaseModel):
    valid: bool
    room: str | None
    qr_payload: str | None
    revoked: bool


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


@router.get("/{token}/validate", response_model=KeyValidationResponse)
def validate_key(token: str, db: Session = Depends(get_db)) -> KeyValidationResponse:
    key = db.query(DigitalKey).filter(DigitalKey.token == token).first()
    if not key:
        return KeyValidationResponse(valid=False, room=None, qr_payload=None, revoked=True)

    now = datetime.now(timezone.utc)
    valid = not key.revoked and _as_utc(key.valid_from) <= now <= _as_utc(key.valid_until)
    return KeyValidationResponse(
        valid=valid,
        room=key.room,
        qr_payload=key.qr_payload,
        revoked=key.revoked,
    )
