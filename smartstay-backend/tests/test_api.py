import os

os.environ["DATABASE_URL"] = "sqlite:///./test_smartstay.db"

from fastapi.testclient import TestClient

from app.database import Base, SessionLocal, engine
from app.main import app
from app.seed import seed_database

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
db = SessionLocal()
seed_database(db)
db.close()

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_lookup_reservation_by_code():
    r = client.get("/api/v1/reservations/lookup", params={"code": "2847"})
    assert r.status_code == 200
    data = r.json()
    assert data["room"] == "412"
    assert data["is_returning_guest"] is True


def test_check_in_flow():
    res = client.get("/api/v1/reservations/lookup", params={"code": "2847"}).json()
    start = client.post(
        "/api/v1/check-in/start",
        json={"reservation_id": res["id"], "language": "pt"},
    )
    assert start.status_code == 200
    session_id = start.json()["session_id"]

    consent = client.post(
        f"/api/v1/check-in/{session_id}/consent",
        json={"consents": {"comfort": True, "stay": True, "consumption": False}},
    )
    assert consent.status_code == 200

    face = client.post(
        f"/api/v1/check-in/{session_id}/face",
        json={"simulate_match": True},
    )
    assert face.status_code == 200
    assert face.json()["verified"] is True

    complete = client.post(f"/api/v1/check-in/{session_id}/complete")
    assert complete.status_code == 200
    body = complete.json()
    assert "digital_key_token" in body
    assert body["room"] == "412"

    key = client.get(f"/api/v1/keys/{body['digital_key_token']}/validate")
    assert key.json()["valid"] is True


def test_lgpd_export():
    r = client.get("/api/v1/guests/g_v_silva_001/export")
    assert r.status_code == 200
    assert r.json()["guest"]["guest_id"] == "g_v_silva_001"
