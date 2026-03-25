from sqlalchemy.orm import Session
from app.core.rule_engine import evaluate_rules
from app.core.learner_profile import get_learner_profile, update_learner_tier, get_recent_performance

def process_adaptation(db: Session, learner_id: str) -> dict:
    profile = get_learner_profile(db, learner_id)
    
    if not profile:
        return {
            "error": "Learner not found",
            "learner_id": learner_id
        }
    
    performance = get_recent_performance(db, learner_id)
    result = evaluate_rules(performance)
    
    current_tier = profile['current_difficulty_tier']
    new_tier = current_tier
    
    if result['action'] == 'decrease_difficulty' or result['action'] == 'decrease_difficulty AND notify_caregiver':
        new_tier = max(1, current_tier - 1)
    elif result['action'] == 'increase_difficulty' or result['action'] == 'increase_difficulty AND notify_caregiver':
        new_tier = min(3, current_tier + 1)
    
    if new_tier != current_tier:
        update_learner_tier(db, learner_id, new_tier)
    
    hint_frequency = 'high' if performance['error_rate'] > 0.5 else 'normal'
    pacing = 'slow' if performance['consecutive_errors'] >= 2 else 'normal'
    
    return {
        "learner_id": learner_id,
        "learner_name": profile['name'],
        "previous_tier": current_tier,
        "difficulty_tier": new_tier,
        "pacing": pacing,
        "hint_frequency": hint_frequency,
        "feedback_type": "audio_visual",
        "rule_triggered": result['rule_triggered'],
        "rule_id": result['rule_id'],
        "explanation": result['explanation'],
        "performance": performance
    }