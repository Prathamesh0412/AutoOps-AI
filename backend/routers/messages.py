from __future__ import annotations

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from ..ai.llm_service import LLMService
from ..database import get_db
from ..schemas import MessageCreate, MessageResponse
from ..services import ActionService, DecisionService, MessageService

router = APIRouter(prefix="/messages", tags=["messages"])


def _message_service(db: Session = Depends(get_db)) -> MessageService:
    llm_service = LLMService()
    decision_service = DecisionService()
    action_service = ActionService(db, llm_service)
    return MessageService(db, llm_service, decision_service, action_service)


@router.get("/", response_model=list[MessageResponse])
def list_messages(service: MessageService = Depends(_message_service)):
    return service.list_messages()


@router.post("/", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def create_message(payload: MessageCreate, service: MessageService = Depends(_message_service)):
    message, _ = service.create_message(payload)
    return message
