import express from 'express';
import aiController from '../controllers/ai.controller.js';
import { protect } from '../middlewares/auth.middlewares.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Submission-based AI features
router.post('/submissions/:submissionId/analyze', aiController.analyzeSubmission);
router.get('/submissions/:submissionId/visualize', aiController.generateVisualization);
router.get('/submissions/:submissionId/study-notes', aiController.generateStudyNotes);
router.get('/submissions/:submissionId/similar-problems', aiController.getSimilarProblems);

// Custom code analysis
router.post('/analyze', aiController.analyzeCustomCode);
router.post('/code-visualize', aiController.visualizeCode);

// Health check
router.get('/health', aiController.healthCheck);

export default router;
