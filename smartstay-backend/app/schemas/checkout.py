from pydantic import BaseModel, Field

from app.schemas.common import ReservationResponse


class CheckoutIdentifyRequest(BaseModel):
    reservation_id: str | None = None
    face_embedding_id: str | None = None
    vector_hash: str | None = None
    kiosk_id: str = "totem-01"


class CheckoutSummaryResponse(BaseModel):
    session_id: str
    reservation: ReservationResponse
    guest_name: str
    room: str
    nights: int
    extras: list[dict] = Field(default_factory=list)
    total_amount: float


class CheckoutConfirmResponse(BaseModel):
    session_id: str
    status: str
    message: str


class CheckoutRateRequest(BaseModel):
    rating: float = Field(ge=1, le=5)
    comment: str | None = None


class CheckoutRateResponse(BaseModel):
    session_id: str
    rating: float
    guest_average_rating: float
