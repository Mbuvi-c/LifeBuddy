from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.adaptation import process_adaptation, reset_frustration_for_new_session, store_onboarding_baseline
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class SessionLogRequest(BaseModel):
    learner_id: str
    simulation_type: str
    task_type: str
    success: bool
    error_type: Optional[str] = None
    response_time: int = 0
    attempt_number: int = 1
    skill: str = "money_transactions"
    response_type: str = "correct"
    hints_used: int = 0
    quit_signal: bool = False

@router.post("/session/log")
def log_session(request: SessionLogRequest, db: Session = Depends(get_db)):
    adaptation = process_adaptation(
        db=db,
        learner_id=request.learner_id,
        skill=request.skill,
        response_type=request.response_type,
        hints_used=request.hints_used,
        quit_signal=request.quit_signal,
        simulation_type=request.simulation_type,
        task_type=request.task_type,
        success=request.success,
        error_type=request.error_type,
        response_time=request.response_time,
        attempt_number=request.attempt_number
    )
    return {
        "message": "Session logged and adaptation processed",
        "adaptation": adaptation
    }

class OnboardingBaselineRequest(BaseModel):
    learner_id:         str
    skill_baselines:    dict
    consent_type:       str
    recommended_skill:  str
    hci_defaults:       dict

@router.post("/onboarding/baseline")
async def onboarding_baseline(request: OnboardingBaselineRequest, db: Session = Depends(get_db)):
    result = await store_onboarding_baseline(request.learner_id, request.skill_baselines, db)
    return {"success": result.get("success", False), "learner_id": request.learner_id}


@router.post("/session/start/{learner_id}")
def start_session(learner_id: str, db: Session = Depends(get_db)):
    """
    Call this when a learner starts a new session.
    Partially resets frustration index from previous session.
    """
    new_frustration = reset_frustration_for_new_session(db, learner_id)
    return {
        "message": "Session started",
        "learner_id": learner_id,
        "frustration_index_reset_to": new_frustration
    }

@router.get("/skill/next/{learner_id}")
def get_next_skill(learner_id: str, db: Session = Depends(get_db)):
    """
    Returns the recommended next skill for this learner to practice.
    Based on current mastery levels and skill dependency graph.
    The frontend calls this before starting each new task.
    """
    from app.core.adaptation import get_bkt_profile
    from app.core.bkt_model import get_next_skill as bkt_next_skill

    bkt_profile = get_bkt_profile(db, learner_id)

    if not bkt_profile:
        return {
            "learner_id": learner_id,
            "next_skill": "personal_hygiene",
            "reason": "No profile found. Starting from beginning."
        }

    next_skill = bkt_next_skill(bkt_profile)

    if next_skill is None:
        return {
            "learner_id": learner_id,
            "next_skill": None,
            "reason": "All skills mastered. Learner has completed the programme."
        }

    # Get current mastery for context
    mastery = bkt_profile["skills"].get(next_skill, {}).get("mastery", 0.0)

    return {
        "learner_id":  learner_id,
        "next_skill":  next_skill,
        "mastery":     mastery,
        "reason": f"Mastery at {round(mastery * 100)}%. Continue practising {next_skill}."
    }

@router.get("/adapt/{learner_id}")
def get_adaptation(learner_id: str, db: Session = Depends(get_db)):
    adaptation = process_adaptation(db=db, learner_id=learner_id)
    return adaptation

@router.post("/learner/reset/{learner_id}")
def reset_learner(learner_id: str, db: Session = Depends(get_db)):
    from sqlalchemy import text

    # Collect session IDs for this learner before deleting
    session_rows = db.execute(
        text("SELECT id FROM sessions WHERE learner_id = :lid"),
        {"lid": learner_id}
    ).fetchall()
    session_ids = [str(r.id) for r in session_rows]

    if session_ids:
        id_list = tuple(session_ids)
        db.execute(
            text("DELETE FROM task_events WHERE session_id IN :ids"),
            {"ids": id_list}
        )
        db.execute(
            text("DELETE FROM adaptation_logs WHERE session_id IN :ids"),
            {"ids": id_list}
        )
        db.execute(
            text("DELETE FROM frustration_log WHERE session_id IN :ids"),
            {"ids": id_list}
        )

    db.execute(
        text("DELETE FROM frustration_log WHERE learner_id = :lid"),
        {"lid": learner_id}
    )
    db.execute(
        text("DELETE FROM sessions WHERE learner_id = :lid"),
        {"lid": learner_id}
    )
    db.execute(
        text("""UPDATE learners
                SET bkt_profile = '{}'::jsonb,
                    frustration_index = 0,
                    current_difficulty_tier = 1,
                    peak_frustration_count = 0
                WHERE id = :lid"""),
        {"lid": learner_id}
    )
    db.commit()
    return {"success": True, "learner_id": learner_id}


@router.get("/health")
def health_check():
    return {
        "message": "Adaptive engine is running",
        "status": "ok"
    }

@router.get("/notifications/{caregiver_id}")
def get_notifications(caregiver_id: str, db: Session = Depends(get_db)):
    """
    Returns all unread notifications for a caregiver.
    The caregiver dashboard polls this to show alerts.
    """
    from sqlalchemy import text
    results = db.execute(
        text("""
            SELECT n.id, n.type, n.message, n.frustration_index, 
                   n.created_at, l.name as learner_name
            FROM notifications n
            JOIN learners l ON n.learner_id = l.id
            WHERE n.caregiver_id = :cid
            AND n.read = false
            ORDER BY n.created_at DESC
        """),
        {"cid": caregiver_id}
    ).fetchall()

    return {
        "caregiver_id": caregiver_id,
        "unread_count": len(results),
        "notifications": [
            {
                "id":                str(r.id),
                "type":              r.type,
                "message":           r.message,
                "frustration_index": r.frustration_index,
                "learner_name":      r.learner_name,
                "created_at":        str(r.created_at)
            }
            for r in results
        ]
    }

@router.post("/notifications/{notification_id}/read")
def mark_notification_read(notification_id: str, db: Session = Depends(get_db)):
    """
    Mark a notification as read once the caregiver has seen it.
    """
    from sqlalchemy import text
    db.execute(
        text("UPDATE notifications SET read = true WHERE id = :nid"),
        {"nid": notification_id}
    )
    db.commit()
    return {"message": "Notification marked as read", "id": notification_id}

class EndSessionRequest(BaseModel):
    promoted_with_remediation: Optional[bool] = False

@router.post("/session/end/{learner_id}")
def end_session_route(learner_id: str, request: EndSessionRequest = EndSessionRequest(), db: Session = Depends(get_db)):
    """
    Closes the current open session and returns a full summary.
    Call this when the learner finishes or exits a session.
    """
    from app.core.adaptation import end_session
    result = end_session(db, learner_id, promoted_with_remediation=request.promoted_with_remediation)
    return result