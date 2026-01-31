import enum

from sqlalchemy import Column, DateTime, Enum, Integer, String, func
from sqlalchemy.orm import relationship

from ..database import Base


class RiskLevel(str, enum.Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class Customer(Base):
    """Represents an SME customer whose signals we monitor for churn risk."""

    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    risk_level = Column(Enum(RiskLevel), nullable=False, default=RiskLevel.LOW)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    messages = relationship("Message", back_populates="customer", cascade="all, delete-orphan")
    actions = relationship("Action", back_populates="customer")
