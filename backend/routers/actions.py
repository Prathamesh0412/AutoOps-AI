from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..ai.llm_service import LLMService
from ..database import get_db
from ..schemas import ActionResponse
from ..services import ActionService

router = APIRouter(prefix="/actions", tags=["actions"])


def _action_service(db: Session = Depends(get_db)) -> ActionService:
    llm_service = LLMService()
    return ActionService(db, llm_service)


@router.get("/", response_model=list[ActionResponse])
def list_actions(service: ActionService = Depends(_action_service)):
    return service.list_actions()


@router.post("/{action_id}/approve", response_model=ActionResponse)
def approve_action(action_id: int, service: ActionService = Depends(_action_service)):
    try:
        return service.approve_action(action_id)
    except LookupError as exc:  # keeps service layer framework-agnostic
        raise HTTPException(status_code=404, detail=str(exc)) from exc
