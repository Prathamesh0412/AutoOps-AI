from __future__ import annotations

from typing import Optional

from sqlalchemy.orm import Session

from ..ai.llm_service import AnalysisResult
from ..models import Customer, Message, RiskLevel, Sentiment


class DecisionService:
    """Encapsulates deterministic business rules separate from AI output."""

    NEGATIVE_STREAK_THRESHOLD = 2

    def evaluate_message(
        self,
        db: Session,
        customer: Customer,
        message: Message,
        analysis: AnalysisResult,
    ) -> Optional[str]:
        """Return the reason we should open an action, or None if no action is required."""

        if analysis.risk_level == RiskLevel.HIGH:
            return f"LLM flagged high churn risk: {analysis.reason}"

        recent_negatives = (
            db.query(Message)
            .filter(Message.customer_id == customer.id, Message.sentiment == Sentiment.NEGATIVE)
            .order_by(Message.created_at.desc())
            .limit(self.NEGATIVE_STREAK_THRESHOLD)
            .all()
        )

        if len(recent_negatives) >= self.NEGATIVE_STREAK_THRESHOLD:
            return (
                "Customer sent two negative messages in a row; escalate with a retention draft."
            )

        if analysis.sentiment == Sentiment.NEGATIVE and customer.risk_level == RiskLevel.MEDIUM:
            return "Customer continues to show dissatisfaction while already medium risk."

        return None
