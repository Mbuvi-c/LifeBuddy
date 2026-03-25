import pool from '../config/database';

export const createSession = async (
  learner_id: string,
  simulation_type: string
) => {
  const result = await pool.query(
    `INSERT INTO sessions (learner_id, simulation_type)
     VALUES ($1, $2)
     RETURNING *`,
    [learner_id, simulation_type]
  );
  return result.rows[0];
};

export const endSession = async (
  id: string,
  total_tasks: number,
  successful_tasks: number
) => {
  const result = await pool.query(
    `UPDATE sessions
     SET end_time = NOW(), completed = true,
     total_tasks = $1, successful_tasks = $2
     WHERE id = $3
     RETURNING *`,
    [total_tasks, successful_tasks, id]
  );
  return result.rows[0];
};

export const logTaskEvent = async (
  session_id: string,
  task_type: string,
  success: boolean,
  error_type: string,
  response_time: number,
  attempt_number: number
) => {
  const result = await pool.query(
    `INSERT INTO task_events
     (session_id, task_type, success, error_type, response_time, attempt_number)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [session_id, task_type, success, error_type, response_time, attempt_number]
  );
  return result.rows[0];
};

export const getSessionsByLearner = async (learner_id: string) => {
  const result = await pool.query(
    `SELECT * FROM sessions WHERE learner_id = $1
     ORDER BY start_time DESC`,
    [learner_id]
  );
  return result.rows;
};