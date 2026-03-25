import { Request, Response } from 'express';
import { createLearner, getLearnerById, getAllLearners, updateLearnerTier } from '../models/Learner';

export const addLearner = async (req: Request, res: Response) => {
  try {
    const { learner_code, name, age, condition, caregiver_id } = req.body;
    const learner = await createLearner(learner_code, name, age, condition, caregiver_id);
    res.status(201).json({ message: 'Learner created successfully', learner });
  } catch (error) {
    res.status(500).json({ message: 'Error creating learner', error });
  }
};

export const getLearner = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const learner = await getLearnerById(id);
    if (!learner) {
      res.status(404).json({ message: 'Learner not found' });
      return;
    }
    res.json(learner);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching learner', error });
  }
};

export const getLearners = async (req: Request, res: Response) => {
  try {
    const learners = await getAllLearners();
    res.json(learners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching learners', error });
  }
};

export const updateTier = async (req: Request, res: Response) => {
  try {
    const { tier } = req.body;
    const id = req.params.id as string;
    const learner = await updateLearnerTier(id, tier);
    res.json({ message: 'Difficulty tier updated', learner });
  } catch (error) {
    res.status(500).json({ message: 'Error updating tier', error });
  }
};