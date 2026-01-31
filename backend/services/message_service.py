from __future__ import annotations

from typing import Optional, Tuple

from sqlalchemy.orm import Session

from ..ai.llm_service import AnalysisResult, LLMService
from ..models import Customer, Message, RiskLevel
from ..schemas import MessageCreate
from .action_service import ActionService
from .decision_service import DecisionService


class MessageService:
    """Coordinates message ingestion, AI analysis, and downstream decisions."""

    def __init__(
        self,
        db: Session,
        llm_service: LLMService,
        decision_service: DecisionService,
        action_service: ActionService,
    ) -> None:
        self.db = db
        self.llm_service = llm_service
        self.decision_service = decision_service
        self.action_service = action_service

    def list_messages(self) -> list[Message]:
        return self.db.query(Message).order_by(Message.created_at.desc()).all()

    def create_message(self, payload: MessageCreate) -> Tuple[Message, Optional[int]]:
        customer = self._get_or_create_customer(payload)

        message = Message(
            customer_id=customer.id,
            content=payload.content,
            source=payload.source,
        )
        self.db.add(message)
        self.db.commit()
        self.db.refresh(message)

        analysis = self.llm_service.analyze_text(payload.content)
        self._persist_analysis(customer, message, analysis)

        trigger_reason = self.decision_service.evaluate_message(self.db, customer, message, analysis)
        action_id = None
        if trigger_reason:
            action = self.action_service.create_retention_action(customer, message, trigger_reason)
            action_id = action.id

        return message, action_id

    def _get_or_create_customer(self, payload: MessageCreate) -> Customer:
        email = payload.customer.email.lower()
        customer = (
            self.db.query(Customer)
            .filter(Customer.email == email)
            .one_or_none()
        )
        if customer:
            customer.name = payload.customer.name
            return customer

        customer = Customer(
            name=payload.customer.name,
            email=email,
            risk_level=RiskLevel.LOW,
        )
        self.db.add(customer)
        self.db.commit()
        self.db.refresh(customer)
        return customer

    def _persist_analysis(self, customer: Customer, message: Message, analysis: AnalysisResult) -> None:
        customer.risk_level = analysis.risk_level
        message.sentiment = analysis.sentiment
        message.analysis_reason = analysis.reason
        self.db.commit()
        self.db.refresh(customer)
        self.db.refresh(message)
