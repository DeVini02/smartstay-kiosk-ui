from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.common import ConsentSource, GuestConsents, GuestPreferences, GuestProfileResponse, PreferenceCategory


class ConsentUpdateItem(BaseModel):
    category: PreferenceCategory
    consented: bool
    source: ConsentSource = "profile_edit"


class PreferencesPatchRequest(BaseModel):
    category: PreferenceCategory
    data: dict


class ConsentLogEntry(BaseModel):
    category: str
    consented: bool
    source: str
    created_at: datetime

    model_config = {"from_attributes": True}


class LgpdExportResponse(BaseModel):
    guest: GuestProfileResponse
    consent_history: list[ConsentLogEntry]
    reservations: list[dict]
    exported_at: datetime
