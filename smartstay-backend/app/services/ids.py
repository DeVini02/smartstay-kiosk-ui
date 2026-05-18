import secrets
import uuid


def new_id(prefix: str = "") -> str:
    uid = uuid.uuid4().hex[:12]
    return f"{prefix}{uid}" if prefix else uid


def new_token() -> str:
    return secrets.token_urlsafe(32)
