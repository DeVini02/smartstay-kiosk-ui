from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.common import GuestConsents, GuestProfileResponse, IoTCommandResponse, ReservationResponse


class ReservationLookupQuery(BaseModel):
    code: str | None = Field(None, min_length=4, max_length=4, description="Últimos 4 dígitos do código")
    document: str | None = Field(None, min_length=11, max_length=14)


class CheckInStartRequest(BaseModel):
    reservation_id: str
    kiosk_id: str = "totem-01"
    language: str = "pt"


class CheckInStartResponse(BaseModel):
    session_id: str
    reservation: ReservationResponse
    guest_profile: GuestProfileResponse | None


class ConsentUpdateRequest(BaseModel):
    consents: GuestConsents


class FaceVerifyRequest(BaseModel):
    """O totem envia apenas o hash/ID do embedding — nunca a imagem."""

    face_embedding_id: str | None = None
    vector_hash: str | None = None
    simulate_match: bool = False


class FaceVerifyResponse(BaseModel):
    verified: bool
    guest_id: str | None
    face_embedding_id: str | None
    is_returning_guest: bool


class CheckInCompleteResponse(BaseModel):
    session_id: str
    digital_key_token: str
    qr_payload: str
    room: str
    guest_name: str
    wifi_ssid: str
    wifi_password: str
    iot_commands: list[IoTCommandResponse]
    apply_personalization: bool


class CheckInSessionResponse(BaseModel):
    session_id: str
    status: str
    reservation: ReservationResponse
    guest_profile: GuestProfileResponse | None
    face_verified: bool
    created_at: datetime
