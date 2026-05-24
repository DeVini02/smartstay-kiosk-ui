from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.security import require_kiosk_auth
from app.seed import reset_demo_database

router = APIRouter(
    prefix="/demo",
    tags=["demo"],
    dependencies=[Depends(require_kiosk_auth)],
)


@router.post("/reset", response_model=dict)
def reset_demo(db: Session = Depends(get_db)) -> dict:
    if not (settings.demo_mode or settings.environment == "development"):
        raise HTTPException(404, "Demo reset is not available.")

    return reset_demo_database(db)
