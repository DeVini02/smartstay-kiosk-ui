from datetime import date, datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.guest import ConsentLog, FaceEmbedding, Guest
from app.models.reservation import Reservation
from app.models.session import (
    CheckInSession,
    CheckoutSession,
    DigitalKey,
    IoTCommandLog,
    Review,
)


def seed_database(db: Session) -> None:
    if db.query(Guest).filter(Guest.id == "g_v_silva_001").first():
        return

    now = datetime.now(timezone.utc)

    # =====================================================================
    # HOSPEDE 1: Vinicius da Silva (retornante, 7 estadias)
    # =====================================================================
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

    # -- Consent logs do Vinicius (historico LGPD) --
    db.add_all([
        ConsentLog(
            guest_id=guest.id,
            category="comfort",
            consented=True,
            source="checkin",
            ip_address="192.168.1.100",
            created_at=now - timedelta(days=90),
        ),
        ConsentLog(
            guest_id=guest.id,
            category="stay",
            consented=True,
            source="checkin",
            ip_address="192.168.1.100",
            created_at=now - timedelta(days=90),
        ),
        ConsentLog(
            guest_id=guest.id,
            category="consumption",
            consented=False,
            source="checkin",
            ip_address="192.168.1.100",
            created_at=now - timedelta(days=90),
        ),
    ])

    # -- Reserva ativa (disponivel para check-in no totem) --
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

    # -- Reserva passada (ja completou check-in e check-out) --
    res_past = Reservation(
        id="res_past_208",
        code_suffix="7731",
        guest_id=guest.id,
        guest_name="V. da Silva",
        room="208",
        room_type="Superior",
        floor=2,
        wing="oeste",
        check_in=date(2026, 3, 10),
        check_out=date(2026, 3, 14),
        status="checked_out",
        created_at=now - timedelta(days=72),
    )
    db.add(res_past)

    # -- Sessao de check-in completa (reserva passada) --
    ci_past = CheckInSession(
        id="ci_past_001",
        reservation_id=res_past.id,
        guest_id=guest.id,
        kiosk_id="totem-01",
        status="completed",
        language="pt",
        consents_snapshot={"comfort": True, "stay": True, "consumption": False},
        face_verified=True,
        face_embedding_id="fe_a8b2c4",
        created_at=now - timedelta(days=72),
        completed_at=now - timedelta(days=72) + timedelta(minutes=4),
    )
    db.add(ci_past)

    # -- Chave digital (revogada apos check-out) --
    dk_past = DigitalKey(
        id="dk_past_001",
        token="xR7kP2mN9qLwYs4vBt6hJc8dFe0gAi3u",
        reservation_id=res_past.id,
        check_in_session_id=ci_past.id,
        room="208",
        qr_payload="smartstay://room/208/checkin/xR7kP2mN9qLwYs4vBt6hJc8dFe0gAi3u",
        valid_from=now - timedelta(days=72),
        valid_until=now - timedelta(days=68),
        revoked=True,
    )
    db.add(dk_past)

    # -- Comandos IoT da estadia passada --
    iot_base_time = now - timedelta(days=72) + timedelta(minutes=3)
    db.add_all([
        IoTCommandLog(
            check_in_session_id=ci_past.id,
            guest_id=guest.id,
            room="208",
            device="thermostat",
            action="setTemperature",
            value={"temperature": 22},
            status="completed",
            created_at=iot_base_time,
            completed_at=iot_base_time + timedelta(seconds=1),
        ),
        IoTCommandLog(
            check_in_session_id=ci_past.id,
            guest_id=guest.id,
            room="208",
            device="lighting",
            action="setScene",
            value={"tone": "warm", "brightness": 60},
            status="completed",
            created_at=iot_base_time + timedelta(seconds=1),
            completed_at=iot_base_time + timedelta(seconds=2),
        ),
        IoTCommandLog(
            check_in_session_id=ci_past.id,
            guest_id=guest.id,
            room="208",
            device="curtains",
            action="setPosition",
            value={"position": "partial"},
            status="completed",
            created_at=iot_base_time + timedelta(seconds=2),
            completed_at=iot_base_time + timedelta(seconds=3),
        ),
        IoTCommandLog(
            check_in_session_id=ci_past.id,
            guest_id=guest.id,
            room="208",
            device="tv",
            action="setChannel",
            value={"channel": "default"},
            status="completed",
            created_at=iot_base_time + timedelta(seconds=3),
            completed_at=iot_base_time + timedelta(seconds=4),
        ),
    ])

    # -- Sessao de check-out completa --
    co_past = CheckoutSession(
        id="co_past_001",
        reservation_id=res_past.id,
        guest_id=guest.id,
        kiosk_id="totem-01",
        status="completed",
        face_verified=True,
        created_at=now - timedelta(days=68),
        completed_at=now - timedelta(days=68) + timedelta(minutes=3),
    )
    db.add(co_past)

    # -- Review da estadia passada --
    review_past = Review(
        checkout_session_id=co_past.id,
        guest_id=guest.id,
        rating=5.0,
        comment="Quarto excelente, temperatura perfeita ao chegar. Adorei a personalização!",
        created_at=now - timedelta(days=68) + timedelta(minutes=3),
    )
    db.add(review_past)

    # =====================================================================
    # HOSPEDE 2: Ana Costa (primeira viagem)
    # =====================================================================
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

    # =====================================================================
    # HOSPEDE 3: Carlos Mendes (retornante, 3 estadias, check-in em andamento)
    # =====================================================================
    guest_carlos = Guest(
        id="g_c_mendes_001",
        full_name="Carlos Mendes",
        document="55566677788",
        email="carlos.mendes@email.com",
        member_since=date(2025, 6, 20),
        total_stays=3,
        average_rating=4.2,
        consents={"comfort": True, "stay": False, "consumption": True},
        preferences={
            "comfort": {
                "temperature": 25,
                "ac_intensity": "high",
                "lighting_tone": "cool",
                "lighting_brightness": 80,
                "curtain_position": "open",
            },
            "consumption": {
                "favorite_frigobar": ["agua mineral", "suco de laranja"],
                "favorite_restaurant_items": ["buffet cafe da manha"],
                "preferred_check_out_time": "14:00",
            },
        },
    )
    db.add(guest_carlos)

    fe_carlos = FaceEmbedding(
        id="fe_d4e5f6",
        guest_id=guest_carlos.id,
        vector_hash="mock_hash_carlos_mendes_v1",
        is_active=True,
    )
    db.add(fe_carlos)

    db.add_all([
        ConsentLog(
            guest_id=guest_carlos.id,
            category="comfort",
            consented=True,
            source="onboarding",
            ip_address="10.0.0.50",
            created_at=now - timedelta(days=30),
        ),
        ConsentLog(
            guest_id=guest_carlos.id,
            category="consumption",
            consented=True,
            source="profile_edit",
            ip_address="10.0.0.50",
            created_at=now - timedelta(days=15),
        ),
    ])

    res_carlos = Reservation(
        id="res_carlos_510",
        code_suffix="3456",
        guest_id=guest_carlos.id,
        guest_name="C. Mendes",
        room="510",
        room_type="Luxo",
        floor=5,
        wing="leste",
        check_in=date(2026, 5, 20),
        check_out=date(2026, 5, 25),
        status="confirmed",
    )
    db.add(res_carlos)

    # -- Sessao de check-in em andamento (parou na verificacao facial) --
    ci_carlos = CheckInSession(
        id="ci_carlos_001",
        reservation_id=res_carlos.id,
        guest_id=guest_carlos.id,
        kiosk_id="totem-02",
        status="consent_given",
        language="en",
        consents_snapshot={"comfort": True, "stay": False, "consumption": True},
        face_verified=False,
        created_at=now - timedelta(minutes=10),
    )
    db.add(ci_carlos)

    # =====================================================================
    # HOSPEDE 4: Maria Oliveira (retornante, atualmente hospedada)
    # =====================================================================
    guest_maria = Guest(
        id="g_m_oliveira_001",
        full_name="Maria Oliveira",
        document="99988877766",
        email="maria.oliveira@email.com",
        member_since=date(2025, 1, 5),
        total_stays=5,
        average_rating=4.6,
        consents={"comfort": True, "stay": True, "consumption": True},
        preferences={
            "comfort": {
                "temperature": 20,
                "ac_intensity": "medium",
                "lighting_tone": "neutral",
                "lighting_brightness": 50,
                "curtain_position": "closed",
            },
            "stay": {
                "preferred_floor": "mid",
                "preferred_view": "north",
                "bed_type": "king",
                "smoking_room": False,
            },
            "consumption": {
                "favorite_frigobar": ["chocolate", "vinho tinto"],
                "favorite_restaurant_items": ["risoto de cogumelos", "tiramisu"],
                "preferred_check_out_time": "11:00",
            },
        },
    )
    db.add(guest_maria)

    fe_maria = FaceEmbedding(
        id="fe_g7h8i9",
        guest_id=guest_maria.id,
        vector_hash="mock_hash_maria_oliveira_v1",
        is_active=True,
    )
    db.add(fe_maria)

    db.add_all([
        ConsentLog(
            guest_id=guest_maria.id,
            category="comfort",
            consented=True,
            source="checkin",
            ip_address="192.168.1.101",
            created_at=now - timedelta(days=3),
        ),
        ConsentLog(
            guest_id=guest_maria.id,
            category="stay",
            consented=True,
            source="checkin",
            ip_address="192.168.1.101",
            created_at=now - timedelta(days=3),
        ),
        ConsentLog(
            guest_id=guest_maria.id,
            category="consumption",
            consented=True,
            source="checkin",
            ip_address="192.168.1.101",
            created_at=now - timedelta(days=3),
        ),
    ])

    res_maria = Reservation(
        id="res_maria_601",
        code_suffix="5502",
        guest_id=guest_maria.id,
        guest_name="M. Oliveira",
        room="601",
        room_type="Suite Master",
        floor=6,
        wing="leste",
        check_in=date(2026, 5, 19),
        check_out=date(2026, 5, 24),
        status="checked_in",
        created_at=now - timedelta(days=5),
    )
    db.add(res_maria)

    ci_maria = CheckInSession(
        id="ci_maria_001",
        reservation_id=res_maria.id,
        guest_id=guest_maria.id,
        kiosk_id="totem-01",
        status="completed",
        language="pt",
        consents_snapshot={"comfort": True, "stay": True, "consumption": True},
        face_verified=True,
        face_embedding_id="fe_g7h8i9",
        created_at=now - timedelta(days=3),
        completed_at=now - timedelta(days=3) + timedelta(minutes=5),
    )
    db.add(ci_maria)

    dk_maria = DigitalKey(
        id="dk_maria_001",
        token="Yw3nKp8mQx6vLr1tHs9jBf4dAe7gCi2u",
        reservation_id=res_maria.id,
        check_in_session_id=ci_maria.id,
        room="601",
        qr_payload="smartstay://room/601/checkin/Yw3nKp8mQx6vLr1tHs9jBf4dAe7gCi2u",
        valid_from=now - timedelta(days=3),
        valid_until=now + timedelta(days=3),
        revoked=False,
    )
    db.add(dk_maria)

    iot_maria_time = now - timedelta(days=3) + timedelta(minutes=4)
    db.add_all([
        IoTCommandLog(
            check_in_session_id=ci_maria.id,
            guest_id=guest_maria.id,
            room="601",
            device="thermostat",
            action="setTemperature",
            value={"temperature": 20},
            status="completed",
            created_at=iot_maria_time,
            completed_at=iot_maria_time + timedelta(seconds=1),
        ),
        IoTCommandLog(
            check_in_session_id=ci_maria.id,
            guest_id=guest_maria.id,
            room="601",
            device="lighting",
            action="setScene",
            value={"tone": "neutral", "brightness": 50},
            status="completed",
            created_at=iot_maria_time + timedelta(seconds=1),
            completed_at=iot_maria_time + timedelta(seconds=2),
        ),
        IoTCommandLog(
            check_in_session_id=ci_maria.id,
            guest_id=guest_maria.id,
            room="601",
            device="curtains",
            action="setPosition",
            value={"position": "closed"},
            status="completed",
            created_at=iot_maria_time + timedelta(seconds=2),
            completed_at=iot_maria_time + timedelta(seconds=3),
        ),
        IoTCommandLog(
            check_in_session_id=ci_maria.id,
            guest_id=guest_maria.id,
            room="601",
            device="tv",
            action="setChannel",
            value={"channel": "default"},
            status="failed",
            created_at=iot_maria_time + timedelta(seconds=3),
            completed_at=iot_maria_time + timedelta(seconds=4),
        ),
    ])

    db.commit()
