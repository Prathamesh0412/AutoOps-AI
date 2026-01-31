"""Utility script to load demo-friendly data for walkthroughs."""

from __future__ import annotations

from pathlib import Path

from pydantic import EmailStr

from ..ai.llm_service import LLMService
from ..database import SessionLocal
from ..schemas import MessageCreate
from ..services import ActionService, DecisionService, MessageService

SAMPLE_MESSAGES = [
    {
        "customer": {"name": "Harper Logistics", "email": EmailStr("ops@harperlogistics.com")},
        "content": "Our renewal is next month but the billing portal still shows last year's rate.",
        "source": "email",
    },
    {
        "customer": {"name": "Northwind Bikes", "email": EmailStr("support@northwind.co")},
        "content": "Shipment delays are killing our launch. I'm close to cancelling if we can't stabilize soon.",
        "source": "support",
    },
    {
        "customer": {"name": "Atlas Finance", "email": EmailStr("ceo@atlasfin.io")},
        "content": "Third outage this quarter. Clients are furious and my board is asking for alternatives.",
        "source": "executive",
    },
]


def seed() -> None:
    db = SessionLocal()
    llm_service = LLMService()
    action_service = ActionService(db, llm_service)
    message_service = MessageService(
        db=db,
        llm_service=llm_service,
        decision_service=DecisionService(),
        action_service=action_service,
    )

    for entry in SAMPLE_MESSAGES:
        payload = MessageCreate(**entry)
        message_service.create_message(payload)

    db.close()
    print("Seeded demo customers, messages, and any resulting actions.")


if __name__ == "__main__":
    db_file = Path("action_agent.db")
    if not db_file.exists():
        print("Database not found yet. Launch the API once before seeding so tables exist.")
    seed()
