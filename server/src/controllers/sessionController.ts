import { Request, Response } from 'express';
import { createSession, endSession, logTaskEvent, getSessionsByLearner } from '../models/Session';

export const startSession = async (req: Request, res: Response) => {
  try {
    const { learner_id, simulation_type } = req.body;
    const session = await createSession(learner_id, simulation_type);
    res.status(201).json({ message: 'Session started', session });
  } catch (error) {
    res.status(500).json({ message: 'Error starting session', error });
  }
};

export const finishSession = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { total_tasks, successful_tasks } = req.body;
    const session = await endSession(id, total_tasks, successful_tasks);
    res.json({ message: 'Session ended', session });
  } catch (error) {
    res.status(500).json({ message: 'Error ending session', error });
  }
};

export const addTaskEvent = async (req: Request, res: Response) => {
  try {
    const session_id = req.params.id as string;
    const { task_type, success, error_type, response_time, attempt_number } = req.body;
    const event = await logTaskEvent(
      session_id, task_type, success, error_type, response_time, attempt_number
    );
    res.status(201).json({ message: 'Task event logged', event });
  } catch (error) {
    res.status(500).json({ message: 'Error logging task event', error });
  }
};

export const getLearnerSessions = async (req: Request, res: Response) => {
  try {
    const learner_id = req.params.learner_id as string;
    const sessions = await getSessionsByLearner(learner_id);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error });
  }
};