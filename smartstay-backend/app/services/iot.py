import asyncio
import random
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.guest import Guest
from app.models.session import IoTCommandLog
from app.schemas.common import IoTCommandResponse
from app.services.ids import new_id


def build_commands_from_profile(guest: Guest, room: str) -> list[dict]:
    comfort = (guest.preferences or {}).get("comfort") or {}
    return [
        {
            "device": "thermostat",
            "action": "setTemperature",
            "value": comfort.get("temperature", 22),
        },
        {
            "device": "lighting",
            "action": "setScene",
            "value": {
                "tone": comfort.get("lighting_tone", "warm"),
                "brightness": comfort.get("lighting_brightness", 60),
            },
        },
        {
            "device": "curtains",
            "action": "setPosition",
            "value": comfort.get("curtain_position", "partial"),
        },
        {
            "device": "tv",
            "action": "setChannel",
            "value": "default",
        },
    ]


async def simulate_device_command(cmd: dict) -> IoTCommandResponse:
    await asyncio.sleep(random.uniform(0.3, 0.8))
    success = random.random() > 0.05
    return IoTCommandResponse(
        device=cmd["device"],
        action=cmd["action"],
        value=cmd["value"],
        status="completed" if success else "failed",
        timestamp=datetime.now(timezone.utc),
    )


def persist_iot_commands(
    db: Session,
    *,
    guest_id: str,
    room: str,
    check_in_session_id: str | None,
    commands: list[IoTCommandResponse],
) -> None:
    for cmd in commands:
        log = IoTCommandLog(
            check_in_session_id=check_in_session_id,
            guest_id=guest_id,
            room=room,
            device=cmd.device,
            action=cmd.action,
            value=cmd.value if isinstance(cmd.value, dict) else {"value": cmd.value},
            status=cmd.status,
            completed_at=cmd.timestamp,
        )
        db.add(log)
    db.commit()


async def apply_guest_preferences(
    db: Session,
    guest: Guest,
    room: str,
    check_in_session_id: str | None = None,
) -> list[IoTCommandResponse]:
    consents = guest.consents or {}
    if not (consents.get("comfort") or consents.get("stay")):
        return []

    raw_cmds = build_commands_from_profile(guest, room)
    results = await asyncio.gather(*[simulate_device_command(c) for c in raw_cmds])
    persist_iot_commands(
        db,
        guest_id=guest.id,
        room=room,
        check_in_session_id=check_in_session_id,
        commands=list(results),
    )
    return list(results)
