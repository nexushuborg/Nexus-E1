import express from 'express';
import { auth } from '../middlewares/auth.middlewares.js';

const router = express.Router();

// Apply authentication middleware to all topic routes
router.use(auth);

// GET /api/topics - Fetch all topics for the logged-in user
router.get('/', async (req, res) => {
  // TODO: Implement controller logic
  // - Fetch topics from database based on user ID
  // - Include topic status, last reviewed date, related submissions
  // - Return sorted by priority/status
  res.json({ message: 'Topics endpoint - implementation pending' });
});

// GET /api/topics/:id - Fetch specific topic details
router.get('/:id', async (req, res) => {
  // TODO: Implement controller logic
  // - Fetch topic by ID for the authenticated user
  // - Include related submissions and progress data
  res.json({ message: 'Topic detail endpoint - implementation pending' });
});

// PUT /api/topics/:id/status - Update topic status
router.put('/:id/status', async (req, res) => {
  // TODO: Implement controller logic
  // - Update topic status (Not Started, In Progress, Completed)
  // - Update last reviewed timestamp
  // - Log status change for analytics
  res.json({ message: 'Status update endpoint - implementation pending' });
});

// POST /api/topics/:id/review - Mark topic as reviewed
router.post('/:id/review', async (req, res) => {
  // TODO: Implement controller logic
  // - Update last reviewed timestamp
  // - Track review frequency and patterns
  res.json({ message: 'Review tracking endpoint - implementation pending' });
});

export default router;
