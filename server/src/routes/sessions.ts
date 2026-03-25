import { Router } from 'express';
import { startSession, finishSession, addTaskEvent, getLearnerSessions } from '../controllers/sessionController';

const router = Router();

// POST start a new session
router.post('/', startSession);

// PUT end a session
router.put('/:id/end', finishSession);

// POST log a task event
router.post('/:id/events', addTaskEvent);

// GET all sessions for a learner
router.get('/learner/:learner_id', getLearnerSessions);

export default router;