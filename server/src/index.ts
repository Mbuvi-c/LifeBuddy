import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database';
import learnersRouter from './routes/learners';
import sessionsRouter from './routes/sessions';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/learners', learnersRouter);
app.use('/api/sessions', sessionsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'LifeBuddy API is running', status: 'ok' });
});

app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected successfully', status: 'ok' });
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed', status: 'error' });
  }
});

app.listen(PORT, () => {
  console.log(`LifeBuddy server running on port ${PORT}`);
});