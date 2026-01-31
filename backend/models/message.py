import enum

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from ..database import Base


class Sentiment(str, enum.Enum):
    POSITIVE = "POSITIVE"
    NEUTRAL = "NEUTRAL"
    NEGATIVE = "NEGATIVE"


class Message(Base):
    """Stores the unstructured customer signal once ingested by the backend."""

    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    source = Column(String(100), nullable=True)
    sentiment = Column(Enum(Sentiment), nullable=False, default=Sentiment.NEUTRAL)
    analysis_reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    customer = relationship("Customer", back_populates="messages")
    actions = relationship("Action", back_populates="message", cascade="all, delete-orphan")
