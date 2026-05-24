from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.guest import Guest
from app.schemas.common import IoTCommandResponse, MessageResponse
from pydantic import BaseModel

from app.security import require_kiosk_auth
from app.services.iot import apply_guest_preferences

router = APIRouter(
    prefix="/iot",
    tags=["iot"],
    dependencies=[Depends(require_kiosk_auth)],
)


class ApplyIoTRequest(BaseModel):
    guest_id: str
    room: str
    check_in_session_id: str | None = None


@router.post("/apply", response_model=list[IoTCommandResponse])
async def apply_iot(body: ApplyIoTRequest, db: Session = Depends(get_db)) -> list[IoTCommandResponse]:
    guest = (
        db.query(Guest)
        .options(joinedload(Guest.face_embeddings))
        .filter(Guest.id == body.guest_id)
        .first()
    )
    if not guest:
        raise HTTPException(404, "Hóspede não encontrado.")
    results = await apply_guest_preferences(
        db, guest, body.room, body.check_in_session_id
    )
    db.commit()
    return results


@router.get("/status", response_model=MessageResponse)
def iot_status() -> MessageResponse:
    return MessageResponse(
        message="Integração IoT em modo simulado (MQTT/Home Assistant planejado para produção)."
    )
