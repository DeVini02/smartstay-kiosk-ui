import secrets
from typing import Annotated

from fastapi import Header, HTTPException

from app.config import settings


def require_kiosk_auth(
    x_smartstay_key: Annotated[str | None, Header()] = None,
) -> None:
    if settings.environment == "development" and not settings.kiosk_api_key:
        return

    if not settings.kiosk_api_key:
        raise HTTPException(503, "Kiosk API key is not configured.")

    if not secrets.compare_digest(x_smartstay_key or "", settings.kiosk_api_key):
        raise HTTPException(401, "Unauthorized kiosk request.")
