"""
LifeBuddy — Simulation API Routes
Endpoints:
  GET  /simulation/tasks/{skill}/{tier}      → task list for a skill at a tier
  POST /simulation/submit                    → log attempt, get next task + adaptation
  GET  /simulation/progress/{learner_id}     → mastery snapshot across all 8 skills
"""

import random
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional

from app.db.database import get_db
from app.core.adaptation import process_adaptation, get_bkt_profile
from app.api.simulations_tasks import get_tasks, get_all_skills

router = APIRouter(prefix="/simulation", tags=["simulation"])


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class SubmitRequest(BaseModel):
    learner_id: str
    skill: str
    tier: int
    task_id: str
    response: str         # learner's chosen answer, e.g. "KES 50" or "yes"
    hints_used: int = 0
    response_time: int    # milliseconds
    quit_signal: bool = False
    attempt_number: int = 1


# ---------------------------------------------------------------------------
# GET /simulation/tasks/{skill}/{tier}
# ---------------------------------------------------------------------------

@router.get("/tasks/{skill}/{tier}", summary="Get tasks for a skill at a given difficulty tier")
def get_simulation_tasks(skill: str, tier: int):
    """
    Returns all tasks for a skill at a given tier (1, 2, or 3).
    The frontend calls this once at session start to load the task queue.
    """
    if skill not in get_all_skills():
        raise HTTPException(
            status_code=404,
            detail=f"Skill '{skill}' not found. Available: {get_all_skills()}"
        )

    if tier not in [1, 2, 3]:
        raise HTTPException(
            status_code=400,
            detail="Tier must be 1, 2, or 3."
        )

    tasks = get_tasks(skill, tier)

    if not tasks:
        raise HTTPException(
            status_code=404,
            detail=f"No tasks found for skill '{skill}' at tier {tier}."
        )

    return {
        "skill": skill,
        "tier": tier,
        "task_count": len(tasks),
        "tasks": tasks
    }


# ---------------------------------------------------------------------------
# POST /simulation/submit
# ---------------------------------------------------------------------------

@router.post("/submit", summary="Submit a task response and receive adaptation")
def submit_task(payload: SubmitRequest, db: Session = Depends(get_db)):
    """
    The core simulation loop endpoint.

    1. Finds the task in simulations_tasks.py and checks the learner's answer
    2. Calls process_adaptation() — the same engine used by /adapt/session/log
    3. Picks the next task based on the updated tier
    4. Returns result + adaptation + next task in one response
    """

    # --- 1. Find the task and check the answer ---
    tasks = get_tasks(payload.skill, payload.tier)
    task = next((t for t in tasks if t["id"] == payload.task_id), None)

    if not task:
        raise HTTPException(
            status_code=404,
            detail=f"Task '{payload.task_id}' not found for skill '{payload.skill}' tier {payload.tier}."
        )

    correct = str(task["correct"]).strip().lower()
    given   = str(payload.response).strip().lower()
    is_correct = (correct == given)

    response_type = "correct" if is_correct else "incorrect"
    if payload.hints_used > 0 and not is_correct:
        response_type = "hint"

    # --- 2. Call the existing adaptation engine ---
    adaptation = process_adaptation(
        db=db,
        learner_id=payload.learner_id,
        skill=payload.skill,
        response_type=response_type,
        hints_used=payload.hints_used,
        quit_signal=payload.quit_signal,
        simulation_type="simulation",
        task_type=task.get("type", "general"),
        success=is_correct,
        error_type=None if is_correct else "incorrect_answer",
        response_time=payload.response_time,
        attempt_number=payload.attempt_number
    )

    if "error" in adaptation:
        raise HTTPException(status_code=404, detail=adaptation["error"])

    # --- 3. Pick the next task using the updated tier ---
    new_tier   = adaptation.get("difficulty_tier", payload.tier)
    next_task  = _pick_next_task(payload.skill, new_tier, payload.task_id)

    # --- 4. Build feedback message ---
    feedback = _build_feedback(is_correct, task, adaptation.get("frustration_status", {}))

    return {
        "success":    True,
        "correct":    is_correct,
        "feedback":   feedback,
        "adaptation": adaptation,
        "next_task":  next_task,
    }


# ---------------------------------------------------------------------------
# GET /simulation/progress/{learner_id}
# ---------------------------------------------------------------------------

@router.get("/progress/{learner_id}", summary="Mastery snapshot across all skills")
def get_progress(learner_id: str, db: Session = Depends(get_db)):
    """
    Returns current mastery and difficulty tier for every skill.
    Used by the Dashboard to render the learner's progress overview.
    """
    bkt_profile = get_bkt_profile(db, learner_id)

    if not bkt_profile:
        raise HTTPException(status_code=404, detail=f"Learner '{learner_id}' not found.")

    skills_data = bkt_profile.get("skills", {}) or {}
    snapshot    = {}

    for skill in get_all_skills():
        data    = skills_data.get(skill, {})
        mastery = float(data.get("mastery", 0.0)) if data else 0.0
        snapshot[skill] = {
            "mastery":        round(mastery, 4),
            "tier":           _mastery_to_tier(mastery),
            "total_attempts": int(data.get("attempts", 0)) if data else 0,
        }

    return {
        "learner_id": learner_id,
        "skills":     snapshot
    }


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _mastery_to_tier(mastery: float) -> int:
    if mastery < 0.40:
        return 1
    elif mastery <= 0.70:
        return 2
    else:
        return 3


def _pick_next_task(skill: str, tier: int, completed_task_id: str) -> Optional[dict]:
    """
    Returns the next task in the queue for the skill at the given tier,
    skipping the task just completed. Returns None when all tasks are done.
    """
    tasks     = get_tasks(skill, tier)
    remaining = [t for t in tasks if t["id"] != completed_task_id]
    return remaining[0] if remaining else None


def _build_feedback(is_correct: bool, task: dict, frustration_status: dict) -> str:
    level = frustration_status.get("level", "normal")
    if is_correct:
        return random.choice([
            "Well done! That is correct.",
            "Great job! You got it right.",
            "Correct! Keep going.",
            "Exactly right! Nice work.",
        ])
    else:
        hint = task.get("hint", "")
        if level in ("high", "critical"):
            return f"No worries — let us try again. Here is a clue: {hint}"
        return f"Not quite. Try again! Hint: {hint}"
