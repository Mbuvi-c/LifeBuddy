"""
test_bkt_model.py
=================
Unit tests for bkt_model.py

Run with:  python -m pytest test_bkt_model.py -v
"""

import pytest
from bkt_model import (
    bkt_update,
    update_frustration_index,
    get_frustration_status,
    get_difficulty_tier,
    get_hci_config,
    get_next_skill,
    process_adaptation,
    SKILLS,
    COLD_START_THRESHOLD,
)


# ---------------------------------------------------------------------------
# bkt_update
# ---------------------------------------------------------------------------

class TestBktUpdate:

    def test_correct_response_increases_mastery(self):
        L, T, S, G = 0.10, 0.15, 0.10, 0.20
        result = bkt_update(L, T, S, G, "correct")
        assert result > L, "Correct response must increase mastery"

    def test_incorrect_response_does_not_spike_mastery(self):
        L, T, S, G = 0.10, 0.15, 0.10, 0.20
        result = bkt_update(L, T, S, G, "incorrect")
        # May still increase due to learning transition, but much less than correct
        correct_result = bkt_update(L, T, S, G, "correct")
        assert result < correct_result, "Incorrect must yield lower mastery than correct"

    def test_hint_between_correct_and_incorrect(self):
        L, T, S, G = 0.10, 0.15, 0.10, 0.20
        correct   = bkt_update(L, T, S, G, "correct")
        hint      = bkt_update(L, T, S, G, "hint")
        incorrect = bkt_update(L, T, S, G, "incorrect")
        assert incorrect < hint < correct, "hint mastery must be between correct and incorrect"

    def test_mastery_stays_in_range(self):
        for response in ["correct", "hint", "incorrect"]:
            result = bkt_update(0.99, 0.15, 0.10, 0.20, response)
            assert 0.0 <= result <= 1.0

    def test_worked_example_correct(self):
        """Verify the worked example from the design guide."""
        # time_management: L=0.10, T=0.15, S=0.10, G=0.20
        result = bkt_update(0.10, 0.15, 0.10, 0.20, "correct")
        assert abs(result - 0.433) < 0.005, f"Expected ~0.433, got {result}"

    def test_worked_example_hint(self):
        """Verify the hint worked example from the design guide."""
        result = bkt_update(0.10, 0.15, 0.10, 0.20, "hint")
        assert abs(result - 0.270) < 0.005, f"Expected ~0.270, got {result}"

    def test_unknown_response_type_treated_as_incorrect(self):
        L, T, S, G = 0.50, 0.15, 0.10, 0.20
        result = bkt_update(L, T, S, G, "unknown_type")
        incorrect = bkt_update(L, T, S, G, "incorrect")
        assert result == incorrect


# ---------------------------------------------------------------------------
# update_frustration_index
# ---------------------------------------------------------------------------

class TestFrustrationIndex:

    def test_incorrect_increases_frustration(self):
        fi = update_frustration_index(0.0, "incorrect")
        assert fi > 0.0

    def test_correct_decreases_frustration(self):
        fi = update_frustration_index(0.5, "correct")
        assert fi < 0.5

    def test_frustration_clamped_at_zero(self):
        fi = update_frustration_index(0.05, "correct")
        assert fi >= 0.0

    def test_frustration_clamped_at_one(self):
        fi = update_frustration_index(0.95, "incorrect", hints_used=3, quit_signal=True)
        assert fi <= 1.0

    def test_quit_signal_large_increase(self):
        fi_no_quit   = update_frustration_index(0.3, "incorrect", quit_signal=False)
        fi_with_quit = update_frustration_index(0.3, "incorrect", quit_signal=True)
        assert fi_with_quit > fi_no_quit

    def test_multiple_hints_increases_frustration(self):
        fi_one_hint  = update_frustration_index(0.3, "hint", hints_used=1)
        fi_many_hint = update_frustration_index(0.3, "hint", hints_used=3)
        assert fi_many_hint > fi_one_hint


# ---------------------------------------------------------------------------
# get_frustration_status
# ---------------------------------------------------------------------------

class TestFrustrationStatus:

    def test_normal_range(self):
        status = get_frustration_status(0.10)
        assert status["level"] == "normal"

    def test_caution_range(self):
        status = get_frustration_status(0.45)
        assert status["level"] == "caution"

    def test_high_range(self):
        status = get_frustration_status(0.65)
        assert status["level"] == "high"

    def test_critical_range(self):
        status = get_frustration_status(0.85)
        assert status["level"] == "critical"
        assert status["notify_caregiver"] is True


# ---------------------------------------------------------------------------
# get_difficulty_tier
# ---------------------------------------------------------------------------

class TestDifficultyTier:

    def test_low_mastery_easy_tier(self):
        assert get_difficulty_tier(0.20, 0.0) == 1

    def test_medium_mastery_medium_tier(self):
        assert get_difficulty_tier(0.55, 0.0) == 2

    def test_high_mastery_hard_tier(self):
        assert get_difficulty_tier(0.80, 0.0) == 3

    def test_high_frustration_forces_easy(self):
        # Even if mastery is high, high frustration forces tier 1
        assert get_difficulty_tier(0.90, 0.65) == 1

    def test_caution_frustration_does_not_force_easy(self):
        # Caution range does not override tier — only HIGH does
        assert get_difficulty_tier(0.80, 0.45) == 3


# ---------------------------------------------------------------------------
# get_hci_config
# ---------------------------------------------------------------------------

class TestHciConfig:

    def test_low_mastery_full_scaffolding(self):
        config = get_hci_config(0.20, 0.0)
        assert config["scaffolding_level"] == "full"
        assert config["hint_frequency"]    == "high"

    def test_high_mastery_minimal_scaffolding(self):
        config = get_hci_config(0.80, 0.0)
        assert config["scaffolding_level"] == "none"
        assert config["hint_frequency"]    == "low"

    def test_high_frustration_maximum_scaffolding(self):
        config = get_hci_config(0.80, 0.70)
        assert config["scaffolding_level"] == "maximum"
        assert config["prompt_modality"]   == "visual_tactile"


# ---------------------------------------------------------------------------
# get_next_skill
# ---------------------------------------------------------------------------

class TestNextSkill:

    def _profile(self, skills_mastery: dict) -> dict:
        return {
            "skills": {
                skill: {"mastery": m, "attempts": 5}
                for skill, m in skills_mastery.items()
            }
        }

    def test_returns_unmastered_skill_with_deps_met(self):
        profile = self._profile({
            "personal_hygiene":       0.60,  # mastered — dep for daily_routine
            "daily_routine":          0.10,  # not mastered
            "object_sorting":         0.10,
            "time_management":        0.10,
            "financial_transactions": 0.10,
        })
        next_skill = get_next_skill(profile)
        # daily_routine should be available since personal_hygiene ≥ 0.40
        assert next_skill is not None

    def test_returns_none_when_all_mastered(self):
        profile = self._profile({
            skill: 0.90 for skill in SKILLS
        })
        assert get_next_skill(profile) is None

    def test_blocked_by_unmet_dependency(self):
        profile = self._profile({
            "personal_hygiene":       0.10,  # NOT mastered — blocks daily_routine
            "daily_routine":          0.10,
            "object_sorting":         0.10,
            "time_management":        0.10,
            "financial_transactions": 0.10,
        })
        next_skill = get_next_skill(profile)
        assert next_skill != "daily_routine"
        assert next_skill != "time_management"


# ---------------------------------------------------------------------------
# process_adaptation — integration
# ---------------------------------------------------------------------------

class TestProcessAdaptation:

    def _fresh_profile(self, attempts: int = 5) -> dict:
        return {
            "learner_id": "test_learner_001",
            "frustration_index": 0.0,
            "skills": {
                skill: {
                    "mastery":            SKILLS[skill]["L"],
                    "attempts":           attempts,
                    "consecutive_correct": 0,
                }
                for skill in SKILLS
            },
        }

    def test_returns_bkt_source_after_cold_start(self):
        profile = self._fresh_profile(attempts=5)
        result  = process_adaptation(profile, "time_management", "correct")
        assert result["source"] == "bkt"

    def test_returns_rule_engine_during_cold_start(self):
        profile = self._fresh_profile(attempts=1)
        result  = process_adaptation(profile, "time_management", "correct")
        assert result["source"] == "rule_engine"

    def test_result_has_required_keys(self):
        profile  = self._fresh_profile()
        result   = process_adaptation(profile, "time_management", "correct")
        required = {
            "mastery", "difficulty_tier", "hci_config",
            "frustration_index", "frustration_status", "next_skill",
            "source", "explanation",
        }
        assert required.issubset(result.keys())

    def test_frustration_updated_in_cold_start(self):
        profile = self._fresh_profile(attempts=1)
        result  = process_adaptation(profile, "time_management", "incorrect",
                                     hints_used=3, quit_signal=True)
        assert result["frustration_index"] > 0.0

    def test_raises_on_unknown_skill(self):
        profile = self._fresh_profile()
        with pytest.raises(ValueError):
            process_adaptation(profile, "unknown_skill", "correct")

    def test_critical_frustration_triggers_status(self):
        profile = self._fresh_profile()
        profile["frustration_index"] = 0.70
        result  = process_adaptation(profile, "time_management", "incorrect",
                                     quit_signal=True)
        assert result["frustration_status"]["level"] in {"high", "critical"}
