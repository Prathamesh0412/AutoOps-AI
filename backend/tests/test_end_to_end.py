from __future__ import annotations

import os
from pathlib import Path

os.environ["DATABASE_URL"] = "sqlite:///./test_action_agent.db"

from fastapi.testclient import TestClient

from ..database import Base, engine
from ..main import app
from ..models import ActionStatus

TEST_DB = Path("test_action_agent.db")

if TEST_DB.exists():
    TEST_DB.unlink()

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

client = TestClient(app)


def test_message_to_action_flow():
    payload = {
        "customer": {"name": "Beacon Retail", "email": "ops@beaconretail.com"},
        "content": "This is the third delayed shipment. If this keeps happening we will cancel our contract.",
        "source": "email",
    }

    response = client.post("/api/messages/", json=payload)
    assert response.status_code == 201
    message = response.json()
    assert message["sentiment"] in {"NEGATIVE", "NEUTRAL", "POSITIVE"}

    actions_response = client.get("/api/actions/")
    assert actions_response.status_code == 200
    actions = actions_response.json()
    assert len(actions) >= 1

    pending_action = next((a for a in actions if a["status"] == "PENDING"), None)
    assert pending_action is not None

    approve_response = client.post(f"/api/actions/{pending_action['id']}/approve")
    assert approve_response.status_code == 200
    approved_action = approve_response.json()
    assert approved_action["status"] == ActionStatus.EXECUTED.value
