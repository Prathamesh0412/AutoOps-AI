from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import Base, engine
from .routers import actions, messages

settings = get_settings()
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(messages.router, prefix=settings.api_prefix)
app.include_router(actions.router, prefix=settings.api_prefix)


@app.get("/health", tags=["ops"])
def healthcheck():
    """Simple readiness probe for container orchestration and monitoring."""

    return {"status": "ok"}
