"""
bkt_model.py
============
Bayesian Knowledge Tracing model for LifeBuddy adaptive engine.

Tracks hidden mastery state per learner per skill using four BKT parameters,
handles hint requests as partial evidence, and maintains a frustration index
that overrides mastery-based decisions when the learner is distressed.
"""

# ---------------------------------------------------------------------------
# Skill definitions
# Each skill has four BKT parameters:
#   L  = P(L0)  prior mastery — probability learner already knows this skill
#   T  = P(T)   learning rate — probability of learning after one attempt
#   S  = P(S)   slip          — probability of error even when mastered
#   G  = P(G)   guess         — probability of correct answer without mastery
# ---------------------------------------------------------------------------

SKILLS = {
    # Skill parameters:
    # L = P(L0)  prior mastery  — probability learner already knows the skill
    # T = P(T)   learning rate  — probability of learning after one attempt
    # S = P(S)   slip           — probability of error even when mastered
    # G = P(G)   guess          — probability of correct answer without mastery
    #
    # Parameter reasoning per skill:
    # money_transactions     — concrete, visual skill. moderate prior, good learning rate
    # time_planning          — abstract concepts. low prior, slower learning rate
    # digital_safety         — some natural intuition. moderate prior and learning rate
    # mobile_money           — complex, Kenya-specific. low prior, slow learning
    # communication_advocacy — most learners have some baseline. higher prior
    # financial_planning     — abstract, adult-facing. very low prior, slow learning
    # community_safety       — mixed familiarity. low-moderate prior
    # workplace_readiness    — very low prior for most learners. slow learning

    "money_transactions":     {"L": 0.15, "T": 0.05, "S": 0.18, "G": 0.35},
    "time_planning":          {"L": 0.15, "T": 0.05, "S": 0.18, "G": 0.35},
    "daily_routine":          {"L": 0.15, "T": 0.05, "S": 0.18, "G": 0.35},
    "digital_safety":         {"L": 0.12, "T": 0.15, "S": 0.10, "G": 0.20},
    "mobile_money":           {"L": 0.05, "T": 0.10, "S": 0.08, "G": 0.15},
    "communication_advocacy": {"L": 0.20, "T": 0.18, "S": 0.10, "G": 0.22},
    "financial_planning":     {"L": 0.05, "T": 0.08, "S": 0.08, "G": 0.12},
    "community_safety":       {"L": 0.10, "T": 0.12, "S": 0.10, "G": 0.18},
    "workplace_readiness":    {"L": 0.05, "T": 0.10, "S": 0.08, "G": 0.15},
}

# ---------------------------------------------------------------------------
# Skill dependency graph
# Each skill lists skills that must reach partial mastery (≥ 0.40)
# before this skill is recommended by the engine.
#
# Foundational skills have no dependencies — any learner can start them.
# Intermediate and advanced skills build on foundational ones.
#
# Progression logic:
# money_transactions     → unlocks mobile_money, financial_planning
# time_planning          → unlocks workplace_readiness
# digital_safety         → unlocks mobile_money
# mobile_money           → unlocks financial_planning
# communication_advocacy → unlocks workplace_readiness, community_safety
# ---------------------------------------------------------------------------

SKILL_GRAPH = {
    # Foundational — no dependencies, any learner starts here
    "money_transactions":     [],
    "time_planning":          [],
    "digital_safety":         [],
    "communication_advocacy": [],

    # Intermediate — requires foundational mastery
    "mobile_money":           ["money_transactions", "digital_safety"],
    "community_safety":       ["communication_advocacy"],

    # Advanced — requires intermediate mastery
    "financial_planning":     ["money_transactions", "mobile_money"],
    "workplace_readiness":    ["time_planning", "communication_advocacy"],
}

# Tier mastery thresholds — used for difficulty tier assignment
TIER_THRESHOLDS = {
    "foundation":    0.00,   # tier 1 — starting point
    "application":   0.40,   # tier 2 — partial mastery
    "independence":  0.70,   # tier 3 — approaching full mastery
}

# Skill display names — used in API responses and caregiver dashboard
SKILL_NAMES = {
    "money_transactions":     "Money & Transactions",
    "time_planning":          "Time & Planning",
    "digital_safety":         "Digital Safety & Communication",
    "mobile_money":           "Mobile Money & M-Pesa",
    "communication_advocacy": "Communication & Self-Advocacy",
    "financial_planning":     "Financial Planning",
    "community_safety":       "Community & Personal Safety",
    "workplace_readiness":    "Workplace Readiness",
}

# Caregiver consent levels per skill
# "open"     — available to all learners, no consent needed
# "consent"  — requires explicit caregiver consent to unlock
SKILL_CONSENT = {
    "money_transactions":     "open",
    "time_planning":          "open",
    "digital_safety":         "open",
    "communication_advocacy": "open",
    "mobile_money":           "consent",
    "community_safety":       "consent",
    "financial_planning":     "consent",
    "workplace_readiness":    "consent",
}

# Minimum attempts before BKT estimates are trusted.
# Below this threshold the rule engine fallback is used.
COLD_START_THRESHOLD = 0

# Mastery thresholds that define difficulty tier boundaries.
MASTERY_EASY_MAX   = 0.40   # below this  → tier 1 (easy)
MASTERY_MEDIUM_MAX = 0.70   # below this  → tier 2 (medium), otherwise tier 3

# Frustration thresholds — higher frustration overrides mastery-based choices.
FRUSTRATION_CAUTION   = 0.40   # hold difficulty, increase hints
FRUSTRATION_HIGH      = 0.65   # force tier 1 regardless of mastery
FRUSTRATION_CRITICAL  = 0.85   # end session, notify caregiver


# ---------------------------------------------------------------------------
# Evidence weighting
# Hints are treated as partial negative evidence — the learner did not
# fully know the answer but was not completely lost either.
# ---------------------------------------------------------------------------

EVIDENCE_WEIGHTS = {
    "correct":   1.0,   # full positive evidence
    "hint":      0.4,   # partial evidence (blend of correct/incorrect posteriors)
    "incorrect": 0.0,   # full negative evidence
}


def get_evidence_weight(response_type: str) -> float:
    """
    Return the evidence weight for a given response type.
    Falls back to 0.0 (treat as incorrect) for unknown types.
    """
    return EVIDENCE_WEIGHTS.get(response_type, 0.0)


# ---------------------------------------------------------------------------
# Core BKT update
# ---------------------------------------------------------------------------

def bkt_update(L: float, T: float, S: float, G: float, response_type: str, response_time: int = 0) -> float:
    """
    Update mastery estimate after one learner attempt.

    Parameters
    ----------
    L             : current mastery estimate  P(mastered)
    T             : learning rate             P(T)
    S             : slip probability          P(S)
    G             : guess probability         P(G)
    response_type : "correct" | "hint" | "incorrect"

    Returns
    -------
    new mastery estimate (float, 0.0 – 1.0)

    Math
    ----
    P(correct)   = L*(1-S) + (1-L)*G
    P(incorrect) = L*S     + (1-L)*(1-G)

    posterior_correct   = L*(1-S) / P(correct)
    posterior_incorrect = L*S     / P(incorrect)

    For hints, blend the two posteriors using evidence weight w:
        posterior = w * posterior_correct + (1-w) * posterior_incorrect

    Apply learning transition:
        L_new = posterior + (1 - posterior) * T
    """
    w = get_evidence_weight(response_type)

    p_correct   = L * (1 - S) + (1 - L) * G
    p_incorrect = L * S       + (1 - L) * (1 - G)

    # Guard against division by zero (degenerate parameter combinations)
    posterior_correct   = (L * (1 - S)) / p_correct   if p_correct   > 0 else L
    posterior_incorrect = (L * S)       / p_incorrect  if p_incorrect > 0 else L

    # Blend posteriors proportionally to evidence weight
    posterior = w * posterior_correct + (1 - w) * posterior_incorrect

    # Modify learning rate based on response time (correct answers only)
    if response_type == "correct" and response_time > 0:
        if response_time < 5000:
            T = T * 1.2   # fast correct — confident, boost learning
        elif response_time >= 8000:
            T = T * 0.8   # slow correct — uncertain, reduce learning gain

    # Apply learning transition — probability learner just acquired the skill
    L_new = posterior + (1 - posterior) * T
    L_new = min(0.99, L_new)

    return round(min(max(L_new, 0.0), 1.0), 4)


# ---------------------------------------------------------------------------
# Frustration index
# ---------------------------------------------------------------------------

def update_frustration_index(
    current_index: float,
    response_type: str,
    hints_used: int = 0,
    quit_signal: bool = False,
    response_time_ms: int = 0,
) -> float:
    """
    Update the frustration index based on the current attempt's signals.
    Now includes response time as an additional signal.

    Response time thresholds:
        < 10000ms  (10s)  — fast, small frustration reduction
        10–30000ms (30s)  — normal, no change
        > 30000ms  (30s)  — slow, small frustration increase
        > 60000ms  (60s)  — very slow, moderate frustration increase
    """
    delta = 0.0

    if response_type == "incorrect":
        delta += 0.07
    elif response_type == "hint":
        delta += 0.08
    elif response_type == "correct":
        delta -= 0.05

    if hints_used > 2:
        delta += 0.10

    if quit_signal:
        delta += 0.25

# Response time signal — slow penalties only apply to incorrect/hint responses
    if response_time_ms > 0:
        if response_time_ms > 60000 and response_type != "correct":
            delta += 0.10   # very slow wrong answer — struggling
        elif response_time_ms > 30000 and response_type != "correct":
            delta += 0.05   # slow wrong answer — slight concern
        elif response_time_ms <= 10000:
            delta -= 0.03   # fast response — confident, reduce frustration slightly

    return round(min(max(current_index + delta, 0.0), 1.0), 4)


def get_frustration_status(frustration_index: float) -> dict:
    """
    Return the current frustration status label, recommended action,
    and a check-in message for the learner when approaching distress.
    """
    if frustration_index >= FRUSTRATION_CRITICAL:
        return {
            "level": "critical",
            "action": "end_session",
            "notify_caregiver": True,
            "checkin_message": None,
            "message": "Learner appears highly distressed. Session ended."
        }
    elif frustration_index >= FRUSTRATION_HIGH:
        return {
            "level": "high",
            "action": "force_easy",
            "notify_caregiver": False,
            "checkin_message": "Would you like to take a break? It's okay to rest. 😊",
            "message": "High frustration detected. Dropping to easy tier."
        }
    elif frustration_index >= FRUSTRATION_CAUTION:
        return {
            "level": "caution",
            "action": "hold_difficulty",
            "notify_caregiver": False,
            "checkin_message": "You're doing great! Take a deep breath. 🌟",
            "message": "Caution zone. Holding current difficulty."
        }
    else:
        return {
            "level": "normal",
            "action": "bkt_drives",
            "notify_caregiver": False,
            "checkin_message": None,
            "message": "Normal. BKT driving adaptation."
        }


# ---------------------------------------------------------------------------
# Difficulty tier selection
# ---------------------------------------------------------------------------

def get_difficulty_tier(mastery: float, frustration_index: float,
                        current_tier: int = None, consecutive_tier_signal: int = 0) -> int:
    """
    Map mastery and frustration to a difficulty tier.
    
    Hysteresis: requires 3 consecutive tier-worthy responses before
    changing tier. Prevents jarring difficulty jumps for neurodiverse learners.

    Returns 1 = easy, 2 = medium, 3 = hard
    """
    if frustration_index >= FRUSTRATION_HIGH:
        return 1  # frustration always overrides

    # What tier does mastery suggest?
    if mastery < MASTERY_EASY_MAX:
        suggested_tier = 1
    elif mastery < MASTERY_MEDIUM_MAX:
        suggested_tier = 2
    else:
        suggested_tier = 3

    # If no current tier provided, just return suggested
    if current_tier is None:
        return suggested_tier

    # If suggested tier matches current — stay
    if suggested_tier == current_tier:
        return current_tier

    # Tier change suggested — only apply after 3 consecutive signals
    if consecutive_tier_signal >= 3:
        return suggested_tier

    # Not enough consecutive signals yet — stay at current tier
    return current_tier

# ---------------------------------------------------------------------------
# HCI scaffolding configuration
# ---------------------------------------------------------------------------

def get_hci_config(mastery: float, frustration_index: float) -> dict:
    """
    Map mastery and frustration to HCI layer parameters.

    Frustration overrides mastery for scaffolding — a distressed learner
    always receives maximum support regardless of mastery level.

    Returns a config dict consumed by the HCI layer.
    """
    if frustration_index >= FRUSTRATION_HIGH:
        return {
            "hint_frequency":    "high",
            "pacing":            "slow",
            "feedback_type":     "audio_visual",
            "prompt_modality":   "visual_tactile",
            "scaffolding_level": "maximum",
        }

    if mastery < MASTERY_EASY_MAX:
        return {
            "hint_frequency":    "high",
            "pacing":            "slow",
            "feedback_type":     "audio_visual",
            "prompt_modality":   "visual_tactile",
            "scaffolding_level": "full",
        }
    elif mastery < MASTERY_MEDIUM_MAX:
        return {
            "hint_frequency":    "medium",
            "pacing":            "normal",
            "feedback_type":     "audio_visual",
            "prompt_modality":   "visual",
            "scaffolding_level": "partial",
        }
    else:
        return {
            "hint_frequency":    "low",
            "pacing":            "normal",
            "feedback_type":     "visual",
            "prompt_modality":   "minimal",
            "scaffolding_level": "none",
        }


# ---------------------------------------------------------------------------
# Skill graph — next skill recommendation
# ---------------------------------------------------------------------------

def get_next_skill(learner_profile: dict) -> str | None:
    """
    Walk the skill graph and return the next skill to practice.

    A skill is recommended when:
      1. All its dependency skills have mastery ≥ 0.40
      2. Its own mastery is below 0.70 (not yet fully mastered)

    Returns None when all skills are mastered.

    Parameters
    ----------
    learner_profile : dict with a "skills" key mapping skill names to
                      {"mastery": float, "attempts": int}
    """
    skills_data = learner_profile.get("skills", {})

    for skill, deps in SKILL_GRAPH.items():
        deps_met = all(
            skills_data.get(d, {}).get("mastery", 0.0) >= MASTERY_EASY_MAX
            for d in deps
        )
        current_mastery = skills_data.get(skill, {}).get("mastery", 0.0)

        if deps_met and current_mastery < MASTERY_MEDIUM_MAX:
            return skill

    return None   # all skills mastered

def apply_mastery_decay(skills: dict, last_practiced: dict) -> dict:
    """
    Apply time-based mastery decay to all skills.
    Called at the start of each session.

    Decay rate: 2% per day without practice.
    Mastery never drops below the skill's prior P(L0) value.

    Parameters
    ----------
    skills         : current bkt_profile skills dict
    last_practiced : dict mapping skill name to last practice ISO timestamp string

    Returns
    -------
    Updated skills dict with decayed mastery values.
    """
    from datetime import datetime, timezone

    DECAY_RATE_PER_DAY = 0.02  # 2% mastery loss per day without practice
    now = datetime.now(timezone.utc)

    updated_skills = {}
    for skill, data in skills.items():
        current_mastery = data.get("mastery", SKILLS.get(skill, {}).get("L", 0.10))
        prior_mastery   = SKILLS.get(skill, {}).get("L", 0.10)
        last_date_str   = last_practiced.get(skill)

        if last_date_str:
            try:
                last_date = datetime.fromisoformat(last_date_str)
                if last_date.tzinfo is None:
                    last_date = last_date.replace(tzinfo=timezone.utc)
                days_inactive = (now - last_date).days

                if days_inactive > 0:
                    # Apply exponential decay
                    decayed = current_mastery * ((1 - DECAY_RATE_PER_DAY) ** days_inactive)
                    # Never drop below prior mastery
                    current_mastery = round(max(decayed, prior_mastery), 4)
            except ValueError:
                pass  # Bad date format — skip decay for this skill

        updated_skills[skill] = {**data, "mastery": current_mastery}

    return updated_skills

    return updated_skills


# ---------------------------------------------------------------------------
# Rule engine fallback (cold start)
# ---------------------------------------------------------------------------

def rule_engine_fallback(learner_profile: dict, skill: str, response_type: str) -> dict:
    """
    Simple rule-based adaptation used when BKT has insufficient data
    (fewer than COLD_START_THRESHOLD attempts on a skill).

    Rules:
      - correct   → stay at current tier or move up if 2 consecutive correct
      - hint      → stay at current tier
      - incorrect → drop one tier

    Returns the same shape dict as process_adaptation() for API consistency.
    """
    skills_data = learner_profile.get("skills", {})
    skill_data  = skills_data.get(skill, {"mastery": SKILLS[skill]["L"], "attempts": 0})
    frustration = learner_profile.get("frustration_index", 0.0)

    current_tier = get_difficulty_tier(skill_data["mastery"], frustration)

    if response_type == "correct":
        consecutive = skill_data.get("consecutive_correct", 0) + 1
        new_tier = min(current_tier + 1, 3) if consecutive >= 2 else current_tier
    elif response_type == "incorrect":
        new_tier = max(current_tier - 1, 1)
    else:
        new_tier = current_tier  # hint — hold

    return {
        "mastery":           skill_data["mastery"],   # unchanged during cold start
        "difficulty_tier":   new_tier,
        "hci_config":        get_hci_config(skill_data["mastery"], frustration),
        "frustration_index": frustration,
        "frustration_status": get_frustration_status(frustration),
        "source":            "rule_engine",
        "explanation":       f"Cold start ({skill_data['attempts']} attempts). Rule engine active."
    }


# ---------------------------------------------------------------------------
# Main adaptation entry point
# ---------------------------------------------------------------------------

def process_adaptation(
    learner_profile: dict,
    skill: str,
    response_type: str,
    hints_used: int = 0,
    quit_signal: bool = False,
) -> dict:
    """
    Main function called after every learner attempt.

    Decides whether to use BKT or the rule engine fallback, updates
    mastery and frustration, and returns a complete adaptation config
    ready for the simulation engine and HCI layer to consume.

    Parameters
    ----------
    learner_profile : full learner state dict (see schema below)
    skill           : skill key from SKILLS dict
    response_type   : "correct" | "hint" | "incorrect"
    hints_used      : number of hints used within this task
    quit_signal     : True if learner attempted to exit mid-task

    Learner profile schema
    ----------------------
    {
      "learner_id": str,
      "frustration_index": float,
      "skills": {
        "<skill_name>": {
          "mastery": float,
          "attempts": int,
          "consecutive_correct": int
        }
      }
    }

    Returns
    -------
    {
      "mastery":            float,
      "difficulty_tier":    int (1|2|3),
      "hci_config":         dict,
      "frustration_index":  float,
      "frustration_status": dict,
      "next_skill":         str | None,
      "source":             "bkt" | "rule_engine",
      "explanation":        str
    }
    """
    if skill not in SKILLS:
        raise ValueError(f"Unknown skill: '{skill}'. Must be one of {list(SKILLS.keys())}")

    skills_data = learner_profile.get("skills", {})
    skill_data  = skills_data.get(skill, {
        "mastery":            SKILLS[skill]["L"],
        "attempts":           0,
        "consecutive_correct": 0,
    })

    frustration = learner_profile.get("frustration_index", 0.0)

    # --- Update frustration ---
    new_frustration = update_frustration_index(
        frustration, response_type, hints_used, quit_signal,
        response_time_ms=learner_profile.get("response_time_ms", 0)
    )
    frustration_status = get_frustration_status(new_frustration)

    # --- BKT update ---
    params      = SKILLS[skill]
    old_mastery = skill_data["mastery"]

    new_mastery = bkt_update(
        L=old_mastery,
        T=params["T"],
        S=params["S"],
        G=params["G"],
        response_type=response_type,
        response_time=learner_profile.get("response_time_ms", 0),
    )

    tier       = get_difficulty_tier(new_mastery, new_frustration)
    hci_config = get_hci_config(new_mastery, new_frustration)
    next_skill = get_next_skill(learner_profile)

    explanation = (
        f"Mastery {skill}: {old_mastery:.3f} → {new_mastery:.3f} "
        f"after '{response_type}'. "
        f"Tier: {tier}. "
        f"Frustration: {frustration:.3f} → {new_frustration:.3f} "
        f"({frustration_status['level']})."
    )

    return {
        "mastery":            new_mastery,
        "difficulty_tier":    tier,
        "hci_config":         hci_config,
        "frustration_index":  new_frustration,
        "frustration_status": frustration_status,
        "next_skill":         next_skill,
        "source":             "bkt",
        "explanation":        explanation,
    }
