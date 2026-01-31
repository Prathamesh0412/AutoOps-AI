from __future__ import annotations

from datetime import UTC, datetime
from typing import Sequence

from sqlalchemy.orm import Session

from ..ai.llm_service import LLMService
from ..models import Action, ActionStatus, ActionType, Customer, Message


class ActionService:
    """Handles lifecycle of retention actions while keeping execution auditable."""

    def __init__(self, db: Session, llm_service: LLMService) -> None:
        self.db = db
        self.llm_service = llm_service

    def list_actions(self) -> Sequence[Action]:
        return (
            self.db.query(Action)
            .order_by(Action.status.asc(), Action.created_at.desc())
            .all()
        )

    def create_retention_action(
        self,
        customer: Customer,
        message: Message,
        trigger_reason: str,
    ) -> Action:
        context = (
            f"Customer: {customer.name} ({customer.email})\n"
            f"Latest message: {message.content}\n"
            f"Flagged reason: {trigger_reason}"
        )
        draft = self.llm_service.generate_email(context)

        action = Action(
            customer_id=customer.id,
            message_id=message.id,
            type=ActionType.RETENTION_EMAIL,
            status=ActionStatus.PENDING,
            draft_content=draft,
            reason=trigger_reason,
        )
        self.db.add(action)
        self.db.commit()
        self.db.refresh(action)
        return action

    def approve_action(self, action_id: int) -> Action:
        action = self.db.get(Action, action_id)
        if action is None:
            raise LookupError("Action not found")

        if action.status == ActionStatus.EXECUTED:
            return action

        action.status = ActionStatus.APPROVED
        action.approved_at = datetime.now(UTC)
        self._execute_action(action)
        self.db.commit()
        self.db.refresh(action)
        return action

    def _execute_action(self, action: Action) -> None:
        """Simulate execution; real integrations would call email/SaaS APIs here."""

        action.status = ActionStatus.EXECUTED
        action.executed_at = datetime.now(UTC)
