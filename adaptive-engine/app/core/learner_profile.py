from sqlalchemy.orm import Session
from sqlalchemy import text

def get_learner_profile(db: Session, learner_id: str) -> dict:
    result = db.execute(
        text("SELECT * FROM learners WHERE id = :id"),
        {"id": learner_id}
    ).fetchone()
    
    if not result:
        return None
    
    return {
        "id": str(result.id),
        "learner_code": result.learner_code,
        "name": result.name,
        "current_difficulty_tier": result.current_difficulty_tier
    }

def update_learner_tier(db: Session, learner_id: str, new_tier: int) -> dict:
    db.execute(
        text("""
            UPDATE learners 
            SET current_difficulty_tier = :tier, updated_at = NOW()
            WHERE id = :id
        """),
        {"tier": new_tier, "id": learner_id}
    )
    db.commit()
    return get_learner_profile(db, learner_id)

def get_recent_performance(db: Session, learner_id: str) -> dict:
    events = db.execute(
        text("""
            SELECT te.success
            FROM task_events te
            JOIN sessions s ON te.session_id = s.id
            WHERE s.learner_id = :id
            ORDER BY te.created_at DESC
            LIMIT 20
        """),
        {"id": learner_id}
    ).fetchall()

    if not events:
        return {
            "consecutive_errors": 0,
            "consecutive_successes": 0,
            "error_rate": 0.0
        }

    # Count consecutive errors from most recent attempt backwards
    consecutive_errors = 0
    for event in events:
        if not event.success:
            consecutive_errors += 1
        else:
            break

    # Count consecutive successes from most recent attempt backwards
    consecutive_successes = 0
    for event in events:
        if event.success:
            consecutive_successes += 1
        else:
            break

    total = len(events)
    errors = sum(1 for e in events if not e.success)
    error_rate = round(errors / total, 2) if total > 0 else 0.0

    return {
        "consecutive_errors": consecutive_errors,
        "consecutive_successes": consecutive_successes,
        "error_rate": error_rate
    }