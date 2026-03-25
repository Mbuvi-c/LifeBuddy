from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.adaptation import process_adaptation
from pydantic import BaseModel

router = APIRouter()

class SessionLogRequest(BaseModel):
    learner_id: str
    simulation_type: str
    task_type: str
    success: bool
    error_type: str = None
    response_time: int = 0
    attempt_number: int = 1

@router.post("/session/log")
def log_session(request: SessionLogRequest, db: Session = Depends(get_db)):
    adaptation = process_adaptation(db, request.learner_id)
    return {
        "message": "Session logged and adaptation processed",
        "adaptation": adaptation
    }

@router.get("/adapt/{learner_id}")
def get_adaptation(learner_id: str, db: Session = Depends(get_db)):
    adaptation = process_adaptation(db, learner_id)
    return adaptation

@router.get("/health")
def health_check():
    return {
        "message": "Adaptive engine is running",
        "status": "ok"
    }