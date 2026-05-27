from sqlalchemy.orm import Session
from app.core.rule_engine import evaluate_rules
from app.core.learner_profile import get_learner_profile, update_learner_tier, get_recent_performance
from app.core.bkt_model import process_adaptation as bkt_process, get_difficulty_tier, apply_mastery_decay
from sqlalchemy import text
from datetime import datetime, timezone
import json


def get_bkt_profile(db: Session, learner_id: str):
    result = db.execute(
        text("SELECT bkt_profile, frustration_index FROM learners WHERE id = :id"),
        {"id": learner_id}
    ).fetchone()
    if not result:
        return None
    return {
        "learner_id": learner_id,
        "frustration_index": float(result.frustration_index),
        "skills": result.bkt_profile
    }


def save_bkt_profile(db: Session, learner_id: str, skill: str, mastery: float, frustration: float):
    db.execute(
        text("""UPDATE learners
               SET frustration_index = :fi,
                   bkt_profile = bkt_profile || jsonb_build_object(
                       :skill, jsonb_build_object(
                           'mastery', CAST(:mastery AS float),
                           'attempts', COALESCE((bkt_profile->:skill->>'attempts')::int, 0) + 1,
                           'consecutive_correct', 0
                       )
                   )
               WHERE id = :id"""),
        {"fi": frustration, "skill": skill, "mastery": mastery, "id": learner_id}
    )
    db.commit()

    # Record last practiced timestamp for this skill
    now_str = datetime.now(timezone.utc).isoformat()
    db.execute(
        text("""UPDATE learners
                SET last_practiced = last_practiced || CAST(:lp AS jsonb)
                WHERE id = :id"""),
        {"lp": json.dumps({skill: now_str}), "id": learner_id}
    )
    db.commit()


def reset_frustration_for_new_session(db: Session, learner_id: str):
    """
    Called at the start of each session:
    1. Reduces frustration by 50%
    2. Applies mastery decay based on days since each skill was last practiced
    """
    result = db.execute(
        text("SELECT frustration_index, bkt_profile, last_practiced FROM learners WHERE id = :id"),
        {"id": learner_id}
    ).fetchone()

    if not result:
        return 0.0

    # 1. Reset frustration by 50%
    current_frustration = float(result.frustration_index)
    new_frustration = round(max(0.0, current_frustration * 0.5), 4)

    # 2. Apply mastery decay
    skills         = result.bkt_profile or {}
    last_practiced = result.last_practiced or {}
    decayed_skills = apply_mastery_decay(skills, last_practiced)

    # 3. Persist both updates
    db.execute(
        text("""UPDATE learners
                SET frustration_index = :fi,
                    bkt_profile = CAST(:profile AS jsonb)
                WHERE id = :id"""),
        {
            "fi":      new_frustration,
            "profile": json.dumps(decayed_skills),
            "id":      learner_id
        }
    )
    db.commit()
    return new_frustration

def get_or_create_session(db: Session, learner_id: str, simulation_type: str) -> str:
    result = db.execute(
        text("""SELECT id FROM sessions
                WHERE learner_id = :lid
                AND end_time IS NULL
                ORDER BY start_time DESC
                LIMIT 1"""),
        {"lid": learner_id}
    ).fetchone()
    if result:
        return str(result.id)
    new_session = db.execute(
        text("""INSERT INTO sessions (learner_id, simulation_type)
                VALUES (:lid, :sim_type)
                RETURNING id"""),
        {"lid": learner_id, "sim_type": simulation_type}
    ).fetchone()
    db.commit()
    return str(new_session.id)


def log_task_event(db: Session, session_id: str, task_type: str, success: bool,
                   error_type: str, response_time: int, attempt_number: int):
    db.execute(
        text("""INSERT INTO task_events
                (session_id, task_type, success, error_type, response_time, attempt_number)
                VALUES (:sid, :tt, :success, :et, :rt, :an)"""),
        {
            "sid":     session_id,
            "tt":      task_type,
            "success": success,
            "et":      error_type,
            "rt":      response_time,
            "an":      attempt_number
        }
    )
    db.commit()


def log_adaptation_event(db: Session, learner_id: str, session_id: str,
                         previous_tier: int, new_tier: int, source: str, explanation: str):
    db.execute(
        text("""INSERT INTO adaptation_logs
                (learner_id, session_id, previous_tier, new_tier, rule_triggered, explanation)
                VALUES (:lid, :sid, :pt, :nt, :rt, :exp)"""),
        {
            "lid": learner_id,
            "sid": session_id,
            "pt":  previous_tier,
            "nt":  new_tier,
            "rt":  source,
            "exp": explanation
        }
    )
    db.commit()


def notify_caregiver(db: Session, learner_id: str, frustration_index: float,
                     explanation: str, skill: str, session_id: str):
    db.execute(
        text("""INSERT INTO frustration_log
                (learner_id, frustration_index, skill, session_id)
                VALUES (:lid, :fi, :skill, :sid)"""),
        {"lid": learner_id, "fi": frustration_index, "skill": skill, "sid": session_id}
    )
    db.execute(
        text("UPDATE learners SET peak_frustration_count = peak_frustration_count + 1 WHERE id = :id"),
        {"id": learner_id}
    )
    db.commit()

    result = db.execute(
        text("SELECT peak_frustration_count, caregiver_id FROM learners WHERE id = :id"),
        {"id": learner_id}
    ).fetchone()

    if not result or not result.caregiver_id:
        return

    peak_count = result.peak_frustration_count
    if peak_count % 3 != 0:
        return

    caregiver = db.execute(
        text("SELECT id, name, email FROM caregivers WHERE id = :cid"),
        {"cid": str(result.caregiver_id)}
    ).fetchone()

    if not caregiver:
        return

    db.execute(
        text("""INSERT INTO notifications
                (caregiver_id, learner_id, type, message, frustration_index)
                VALUES (:cid, :lid, :type, :msg, :fi)"""),
        {
            "cid":  str(caregiver.id),
            "lid":  learner_id,
            "type": "critical_frustration",
            "msg":  f"Your learner has reached peak frustration {peak_count} times "
                    f"and may need support. Latest frustration index: {frustration_index}.",
            "fi":   frustration_index
        }
    )
    db.execute(
        text("UPDATE learners SET peak_frustration_count = 0 WHERE id = :id"),
        {"id": learner_id}
    )
    db.commit()


def process_adaptation(db: Session, learner_id: str, skill: str = "money_transactions",
                       response_type: str = "correct", hints_used: int = 0,
                       quit_signal: bool = False, simulation_type: str = "daily_living",
                       task_type: str = "general", success: bool = True,
                       error_type: str = None, response_time: int = 0,
                       attempt_number: int = 1) -> dict:

    profile = get_learner_profile(db, learner_id)
    if not profile:
        return {"error": "Learner not found", "learner_id": learner_id}

    bkt_profile = get_bkt_profile(db, learner_id)

    if not bkt_profile:
        performance = get_recent_performance(db, learner_id)
        result = evaluate_rules(performance)
        current_tier = profile['current_difficulty_tier']
        new_tier = current_tier
        if 'decrease_difficulty' in result['action']:
            new_tier = max(1, current_tier - 1)
        elif 'increase_difficulty' in result['action']:
            new_tier = min(3, current_tier + 1)
        if new_tier != current_tier:
            update_learner_tier(db, learner_id, new_tier)
        return {
            "learner_id":      learner_id,
            "learner_name":    profile['name'],
            "difficulty_tier": new_tier,
            "source":          "rule_engine",
            "explanation":     result['explanation']
        }

    # Pass response time into BKT profile for frustration calculation
    bkt_profile["response_time_ms"] = response_time

    bkt_result = bkt_process(
        learner_profile=bkt_profile,
        skill=skill,
        response_type=response_type,
        hints_used=hints_used,
        quit_signal=quit_signal
    )

    previous_tier = profile['current_difficulty_tier']

    # Get consecutive tier signal counter from DB
    tier_row = db.execute(
        text("SELECT consecutive_tier_signal FROM learners WHERE id = :id"),
        {"id": learner_id}
    ).fetchone()
    consecutive_tier_signal = tier_row.consecutive_tier_signal if tier_row else 0

    # Raw tier BKT suggests based on mastery alone (no hysteresis)
    bkt_suggested_tier = get_difficulty_tier(
        mastery=bkt_result['mastery'],
        frustration_index=bkt_result['frustration_index'],
    )

    # Frustration always forces easy immediately
    if bkt_result['frustration_index'] >= 0.60:
        final_tier = 1
        new_signal = 0
    elif bkt_suggested_tier != previous_tier:
        new_signal = consecutive_tier_signal + 1
        if new_signal >= 3:
            final_tier = bkt_suggested_tier
            new_signal = 0
        else:
            final_tier = previous_tier
    else:
        final_tier = previous_tier
        new_signal = 0

    bkt_result['difficulty_tier'] = final_tier

    # Update signal counter
    db.execute(
        text("UPDATE learners SET consecutive_tier_signal = :sig WHERE id = :id"),
        {"sig": new_signal, "id": learner_id}
    )
    db.commit()

    save_bkt_profile(db, learner_id, skill, bkt_result['mastery'], bkt_result['frustration_index'])
    update_learner_tier(db, learner_id, final_tier)

    # Log to database
    session_id = get_or_create_session(db, learner_id, simulation_type)
    log_task_event(db, session_id, task_type, success, error_type, response_time, attempt_number)
    if final_tier != previous_tier:
        log_adaptation_event(db, learner_id, session_id, previous_tier,
                             final_tier, bkt_result['source'], bkt_result['explanation'])

    # Notify caregiver if frustration is critical
    if bkt_result['frustration_status']['notify_caregiver']:
        notify_caregiver(db, learner_id, bkt_result['frustration_index'],
                         bkt_result['explanation'], skill, session_id)

    return {
        "learner_id":         learner_id,
        "learner_name":       profile['name'],
        "difficulty_tier":    final_tier,
        "mastery":            bkt_result['mastery'],
        "hci_config":         bkt_result['hci_config'],
        "frustration_index":  bkt_result['frustration_index'],
        "frustration_status": bkt_result['frustration_status'],
        "next_skill":         bkt_result['next_skill'],
        "source":             bkt_result['source'],
        "explanation":        bkt_result['explanation']
    }


def end_session(db: Session, learner_id: str) -> dict:
    """
    Closes the current open session and returns a full summary.
    """
    session = db.execute(
        text("""SELECT id, simulation_type, start_time FROM sessions
                WHERE learner_id = :lid AND end_time IS NULL
                ORDER BY start_time DESC LIMIT 1"""),
        {"lid": learner_id}
    ).fetchone()

    if not session:
        return {"error": "No open session found for this learner"}

    session_id = str(session.id)

    events = db.execute(
        text("""SELECT task_type, success, response_time, attempt_number, created_at
                FROM task_events WHERE session_id = :sid ORDER BY created_at ASC"""),
        {"sid": session_id}
    ).fetchall()

    total_tasks     = len(events)
    successful      = sum(1 for e in events if e.success)
    failed          = total_tasks - successful
    success_rate    = round(successful / total_tasks * 100, 1) if total_tasks > 0 else 0.0
    avg_response_ms = round(sum(e.response_time for e in events) / total_tasks) if total_tasks > 0 else 0

    frustration_events = db.execute(
        text("""SELECT frustration_index, skill, created_at FROM frustration_log
                WHERE session_id = :sid ORDER BY created_at ASC"""),
        {"sid": session_id}
    ).fetchall()

    bkt = db.execute(
        text("SELECT bkt_profile FROM learners WHERE id = :id"),
        {"id": learner_id}
    ).fetchone()

    mastery_snapshot = {}
    if bkt and bkt.bkt_profile:
        mastery_snapshot = {
            s: round(d.get("mastery", 0.0) * 100, 1)
            for s, d in bkt.bkt_profile.items()
        }

    adaptations = db.execute(
        text("""SELECT previous_tier, new_tier, explanation, created_at
                FROM adaptation_logs WHERE session_id = :sid ORDER BY created_at ASC"""),
        {"sid": session_id}
    ).fetchall()

    db.execute(
        text("""UPDATE sessions SET end_time = NOW(), completed = true,
                total_tasks = :total, successful_tasks = :successful WHERE id = :sid"""),
        {"total": total_tasks, "successful": successful, "sid": session_id}
    )
    db.commit()

    return {
        "session_id":      session_id,
        "learner_id":      learner_id,
        "simulation_type": session.simulation_type,
        "start_time":      str(session.start_time),
        "summary": {
            "total_tasks":       total_tasks,
            "successful_tasks":  successful,
            "failed_tasks":      failed,
            "success_rate":      f"{success_rate}%",
            "avg_response_time": f"{avg_response_ms}ms",
            "frustration_peaks": len(frustration_events),
            "tier_changes":      len(adaptations),
        },
        "mastery_snapshot": mastery_snapshot,
        "frustration_journey": [
            {"frustration_index": e.frustration_index, "skill": e.skill, "time": str(e.created_at)}
            for e in frustration_events
        ],
        "tier_changes": [
            {"from": a.previous_tier, "to": a.new_tier, "explanation": a.explanation, "time": str(a.created_at)}
            for a in adaptations
        ]
    }