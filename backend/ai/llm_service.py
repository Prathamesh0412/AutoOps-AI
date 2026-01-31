from __future__ import annotations

from dataclasses import dataclass

import httpx

from ..config import get_settings
from ..models import RiskLevel, Sentiment

LLM_PROMPT = """You are an AI Action Intelligence Engine designed for business decision support, not casual conversation.

Your role is to analyze unstructured business text, predict risk, and generate professional action drafts.

Product: AI Action Agent for SMEs
Use case: Customer churn prevention
Input: Customer emails, feedback, complaints
Output: Structured business intelligence + action drafts
You do NOT execute actions
You do NOT talk to end users
You return JSON only

Responsibilities:
1. Analyze text for sentiment (positive|neutral|negative), risk (low|medium|high), and explanation.
2. Predict business risk based solely on the provided text.
3. Generate polite, empathetic retention email drafts when asked.

Strict rules:
- No markdown or commentary.
- JSON output only.
- Concise but professional business language.

Output formats:
Analysis -> {"sentiment": "negative", "risk_level": "high", "reason": "Customer expressed..."}
Draft -> {"draft": "Professional email text"}

Final behavior: you are a business intelligence assistant supporting an automated decision system, not a chatbot."""


@dataclass
class AnalysisResult:
    sentiment: Sentiment
    risk_level: RiskLevel
    reason: str


class LLMService:
    """Facilitates deterministic calls to the language model with graceful fallbacks."""

    def __init__(self, base_url: str | None = None, api_key: str | None = None) -> None:
        settings = get_settings()
        self.base_url = base_url or settings.ai_base_url
        self.api_key = api_key or settings.ai_api_key

    def analyze_text(self, text: str) -> AnalysisResult:
        """Run the analysis prompt; fall back to heuristics when no LLM is configured."""

        if self.base_url and self.api_key:
            payload = {"prompt": LLM_PROMPT, "mode": "analysis", "text": text}
            data = self._invoke_llm(payload)
            try:
                return AnalysisResult(
                    sentiment=Sentiment(data["sentiment"].upper()),
                    risk_level=RiskLevel(data["risk_level"].upper()),
                    reason=data["reason"],
                )
            except (KeyError, ValueError):
                pass  # fall back if the upstream service drifts from the contract

        return self._fallback_analysis(text)

    def generate_email(self, context: str) -> str:
        """Produce a retention email draft for human review."""

        if self.base_url and self.api_key:
            payload = {"prompt": LLM_PROMPT, "mode": "draft", "context": context}
            data = self._invoke_llm(payload)
            return data.get("draft") or self._fallback_draft(context)

        return self._fallback_draft(context)

    def _invoke_llm(self, payload: dict) -> dict:
        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
        response = httpx.post(self.base_url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        return response.json()

    def _fallback_analysis(self, text: str) -> AnalysisResult:
        lowered = text.lower()
        sentiment = Sentiment.NEUTRAL
        risk = RiskLevel.LOW
        reason = "No explicit risk indicators detected."

        negative_triggers = ["cancel", "angry", "disappointed", "frustrated", "refund", "leaving"]
        high_risk_triggers = ["churn", "switch", "last straw", "done", "terminate"]

        if any(word in lowered for word in negative_triggers):
            sentiment = Sentiment.NEGATIVE
            risk = RiskLevel.MEDIUM
            reason = "Customer expressed dissatisfaction that warrants review."

        if any(word in lowered for word in high_risk_triggers):
            risk = RiskLevel.HIGH
            reason = "Customer explicitly hinted at leaving the service."

        return AnalysisResult(sentiment=sentiment, risk_level=risk, reason=reason)

    def _fallback_draft(self, context: str) -> str:
        return (
            "Hi {{customer_name}},\n\n"
            "Thank you for sharing your concerns. We are sorry for the frustration caused and "
            "have escalated your case so we can resolve it quickly. Our team will update you "
            "within one business day, and I will stay close to ensure we deliver. "
            "Please let me know if there is any additional detail we should consider.\n\n"
            "Best regards,\nCustomer Success Team\n\n"
            f"Context: {context}"
        )
