from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from ..models import RiskLevel, Sentiment


class CustomerPayload(BaseModel):
    """Customer context supplied when ingesting a new message."""

    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr


class MessageCreate(BaseModel):
    customer: CustomerPayload
    content: str = Field(..., min_length=3)
    source: str | None = Field(default=None, max_length=100)


class CustomerSummary(BaseModel):
    id: int
    name: str
    email: EmailStr
    risk_level: RiskLevel

    class Config:
        orm_mode = True


class MessageResponse(BaseModel):
    id: int
    customer: CustomerSummary
    content: str
    sentiment: Sentiment
    analysis_reason: str | None
    source: str | None
    created_at: datetime

    class Config:
        orm_mode = True
