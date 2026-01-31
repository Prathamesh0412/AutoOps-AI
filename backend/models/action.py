import enum

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, Text, func
from sqlalchemy.orm import relationship

from ..database import Base


class ActionType(str, enum.Enum):
    RETENTION_EMAIL = "RETENTION_EMAIL"


class ActionStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    EXECUTED = "EXECUTED"


class Action(Base):
    """Represents a human-in-the-loop automation awaiting approval or execution."""

    __tablename__ = "actions"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    message_id = Column(Integer, ForeignKey("messages.id"), nullable=False, index=True)
    type = Column(Enum(ActionType), nullable=False, default=ActionType.RETENTION_EMAIL)
    status = Column(Enum(ActionStatus), nullable=False, default=ActionStatus.PENDING)
    draft_content = Column(Text, nullable=False)
    reason = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    approved_at = Column(DateTime(timezone=True), nullable=True)
    executed_at = Column(DateTime(timezone=True), nullable=True)

    customer = relationship("Customer", back_populates="actions")
    message = relationship("Message", back_populates="actions")
