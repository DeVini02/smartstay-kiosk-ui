from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.session import DigitalKey
from pydantic import BaseModel

router = APIRouter(prefix="/keys", tags=["digital-keys"])


class KeyValidationResponse(BaseModel):
    valid: bool
    room: str | None
    qr_payload: str | None
    revoked: bool


@router.get("/{token}/validate", response_model=KeyValidationResponse)
def validate_key(token: str, db: Session = Depends(get_db)) -> KeyValidationResponse:
    key = db.query(DigitalKey).filter(DigitalKey.token == token).first()
    if not key:
        return KeyValidationResponse(valid=False, room=None, qr_payload=None, revoked=True)

    now = datetime.now(timezone.utc)
    valid = not key.revoked and key.valid_from <= now <= key.valid_until
    return KeyValidationResponse(
        valid=valid,
        room=key.room,
        qr_payload=key.qr_payload,
        revoked=key.revoked,
    )
