from datetime import date

from sqlalchemy.orm import Session

from app.models.guest import FaceEmbedding, Guest
from app.models.reservation import Reservation


def seed_database(db: Session) -> None:
    if db.query(Guest).filter(Guest.id == "g_v_silva_001").first():
        return

    guest = Guest(
        id="g_v_silva_001",
        full_name="Vinícius da Silva",
        document="12345678901",
        email="v.silva@email.com",
        member_since=date(2024, 3, 15),
        total_stays=7,
        average_rating=4.8,
        consents={"comfort": True, "stay": True, "consumption": False},
        preferences={
            "comfort": {
                "temperature": 22,
                "ac_intensity": "low",
                "lighting_tone": "warm",
                "lighting_brightness": 60,
                "curtain_position": "partial",
            },
            "stay": {
                "preferred_floor": "high",
                "preferred_view": "east",
                "bed_type": "double",
                "smoking_room": False,
            },
        },
    )
    db.add(guest)

    embedding = FaceEmbedding(
        id="fe_a8b2c4",
        guest_id=guest.id,
        vector_hash="mock_hash_vinicius_silva_v1",
        is_active=True,
    )
    db.add(embedding)

    reservation = Reservation(
        id="res_demo_412",
        code_suffix="2847",
        guest_id=guest.id,
        guest_name="V. da Silva",
        room="412",
        room_type="Standard duplo",
        floor=4,
        wing="leste",
        check_in=date(2026, 4, 28),
        check_out=date(2026, 5, 2),
        status="confirmed",
    )
    db.add(reservation)

    # hóspede primeira viagem para testes
    guest_new = Guest(
        id="g_first_stay_001",
        full_name="Ana Costa",
        document="98765432100",
        email="ana@email.com",
        member_since=date(2026, 1, 10),
        total_stays=0,
        average_rating=0.0,
        consents={"comfort": False, "stay": False, "consumption": False},
        preferences={},
    )
    db.add(guest_new)
    db.add(
        Reservation(
            id="res_first_stay",
            code_suffix="1001",
            guest_id=guest_new.id,
            guest_name="Ana Costa",
            room="305",
            room_type="Standard",
            floor=3,
            wing="oeste",
            check_in=date(2026, 5, 18),
            check_out=date(2026, 5, 20),
            status="confirmed",
        )
    )

    db.commit()
