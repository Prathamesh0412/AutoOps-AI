from datetime import datetime

from pydantic import BaseModel

from ..models import ActionStatus, ActionType
from .message_schema import CustomerSummary


class ActionResponse(BaseModel):
    id: int
    customer: CustomerSummary
    message_id: int
    type: ActionType
    status: ActionStatus
    draft_content: str
    reason: str
    created_at: datetime
    approved_at: datetime | None
    executed_at: datetime | None

    class Config:
        orm_mode = True
