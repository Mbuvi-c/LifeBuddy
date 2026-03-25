import pool from '../config/database';

export const createLearner = async (
  learner_code: string,
  name: string,
  age: number,
  condition: string,
  caregiver_id: string
) => {
  const result = await pool.query(
    `INSERT INTO learners 
     (learner_code, name, age, condition, caregiver_id) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [learner_code, name, age, condition, caregiver_id]
  );
  return result.rows[0];
};

export const getLearnerById = async (id: string) => {
  const result = await pool.query(
    'SELECT * FROM learners WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const getAllLearners = async () => {
  const result = await pool.query(
    'SELECT * FROM learners ORDER BY created_at DESC'
  );
  return result.rows;
};

export const updateLearnerTier = async (id: string, tier: number) => {
  const result = await pool.query(
    `UPDATE learners 
     SET current_difficulty_tier = $1, updated_at = NOW() 
     WHERE id = $2 
     RETURNING *`,
    [tier, id]
  );
  return result.rows[0];
};