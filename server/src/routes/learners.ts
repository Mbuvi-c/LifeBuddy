import { Router } from 'express';
import { addLearner, getLearner, getLearners, updateTier } from '../controllers/learnerController';

const router = Router();

// GET all learners
router.get('/', getLearners);

// GET a single learner by ID
router.get('/:id', getLearner);

// POST create a new learner
router.post('/', addLearner);

// PUT update difficulty tier
router.put('/:id/tier', updateTier);

export default router;