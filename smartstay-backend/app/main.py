from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.routers import checkin, checkout, demo, guests, health, iot, keys, reservations
from app.seed import seed_database


@asynccontextmanager
async def lifespan(_: FastAPI):
    if settings.environment == "development" or settings.demo_mode:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            seed_database(db)
        finally:
            db.close()
    yield


app = FastAPI(
    title="SmartStay API",
    description=(
        "API do ecossistema SmartStay AI — totem hoteleiro com check-in/out, "
        "chaves digitais, personalização IoT e conformidade LGPD."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

prefix = settings.api_prefix
app.include_router(health.router)
app.include_router(reservations.router, prefix=prefix)
app.include_router(checkin.router, prefix=prefix)
app.include_router(checkout.router, prefix=prefix)
app.include_router(guests.router, prefix=prefix)
app.include_router(keys.router, prefix=prefix)
app.include_router(iot.router, prefix=prefix)
app.include_router(demo.router, prefix=prefix)


@app.get("/")
def root() -> dict:
    return {
        "service": "SmartStay Backend",
        "docs": "/docs",
        "health": "/health",
        "api": settings.api_prefix,
    }
