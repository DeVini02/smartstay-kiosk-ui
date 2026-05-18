from datetime import date, datetime
from typing import Any, Literal

from pydantic import BaseModel, Field

PreferenceCategory = Literal["comfort", "stay", "consumption"]
ConsentSource = Literal["checkin", "profile_edit", "onboarding"]
SessionStatus = Literal["started", "consent_given", "face_verified", "completed", "cancelled"]
IoTStatus = Literal["pending", "in_progress", "completed", "failed"]


class MessageResponse(BaseModel):
    message: str


class HealthResponse(BaseModel):
    status: str
    service: str
    environment: str
    database: str


class ComfortPrefs(BaseModel):
    temperature: float = 22
    ac_intensity: Literal["low", "medium", "high"] = "low"
    lighting_tone: Literal["warm", "neutral", "cool"] = "warm"
    lighting_brightness: int = Field(60, ge=0, le=100)
    curtain_position: Literal["open", "closed", "partial"] = "partial"


class StayPrefs(BaseModel):
    preferred_floor: Literal["low", "mid", "high"] = "high"
    preferred_view: Literal["east", "west", "north", "south", "any"] = "east"
    bed_type: Literal["double", "twin", "king"] = "double"
    smoking_room: bool = False


class ConsumptionPrefs(BaseModel):
    favorite_frigobar: list[str] = Field(default_factory=list)
    favorite_restaurant_items: list[str] = Field(default_factory=list)
    preferred_check_out_time: str = "12:00"


class GuestPreferences(BaseModel):
    comfort: ComfortPrefs | None = None
    stay: StayPrefs | None = None
    consumption: ConsumptionPrefs | None = None


class GuestConsents(BaseModel):
    comfort: bool = False
    stay: bool = False
    consumption: bool = False


class GuestProfileResponse(BaseModel):
    guest_id: str
    face_embedding_id: str | None
    member_since: date
    total_stays: int
    average_rating: float
    consents: GuestConsents
    preferences: GuestPreferences

    model_config = {"from_attributes": True}


class ReservationResponse(BaseModel):
    id: str
    code: str
    guest_name: str
    room: str
    room_type: str
    check_in: date
    check_out: date
    floor: int
    wing: str
    status: str
    guest_id: str
    is_returning_guest: bool

    model_config = {"from_attributes": True}


class IoTCommandResponse(BaseModel):
    device: str
    action: str
    value: Any
    status: IoTStatus
    timestamp: datetime | None = None
