-- migration_add_bkt_columns.sql
-- ==============================
-- Adds BKT mastery profile and frustration index to the learners table.
-- Run once against your existing Postgres database.
--
-- Usage:
--   psql -U <user> -d <database> -f migration_add_bkt_columns.sql

-- 1. Add frustration index — float, clamped to [0.0, 1.0] by the application
ALTER TABLE learners
  ADD COLUMN IF NOT EXISTS frustration_index FLOAT NOT NULL DEFAULT 0.0;

-- 2. Add BKT profile — JSONB stores mastery + attempts per skill
--    Default initialises all five skills at their prior mastery values.
ALTER TABLE learners
  ADD COLUMN IF NOT EXISTS bkt_profile JSONB NOT NULL DEFAULT '{
    "time_management":        {"mastery": 0.10, "attempts": 0, "consecutive_correct": 0},
    "object_sorting":         {"mastery": 0.15, "attempts": 0, "consecutive_correct": 0},
    "daily_routine":          {"mastery": 0.10, "attempts": 0, "consecutive_correct": 0},
    "financial_transactions": {"mastery": 0.05, "attempts": 0, "consecutive_correct": 0},
    "personal_hygiene":       {"mastery": 0.20, "attempts": 0, "consecutive_correct": 0}
  }'::jsonb;

-- 3. Initialise existing learner rows that currently have NULL / empty profiles
UPDATE learners
SET bkt_profile = '{
    "time_management":        {"mastery": 0.10, "attempts": 0, "consecutive_correct": 0},
    "object_sorting":         {"mastery": 0.15, "attempts": 0, "consecutive_correct": 0},
    "daily_routine":          {"mastery": 0.10, "attempts": 0, "consecutive_correct": 0},
    "financial_transactions": {"mastery": 0.05, "attempts": 0, "consecutive_correct": 0},
    "personal_hygiene":       {"mastery": 0.20, "attempts": 0, "consecutive_correct": 0}
  }'::jsonb
WHERE bkt_profile = '{}'::jsonb OR bkt_profile IS NULL;

-- 4. Index on learner_id for fast profile lookups during real-time adaptation
CREATE INDEX IF NOT EXISTS idx_learners_bkt_profile ON learners USING GIN (bkt_profile);

-- 5. Verify
SELECT
  column_name,
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'learners'
  AND column_name IN ('frustration_index', 'bkt_profile')
ORDER BY column_name;
