import express from 'express';
import aiController from '../controllers/ai.controller.js';
import { protect } from '../middlewares/auth.middlewares.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Custom code analysis
router.post('/analyze', aiController.analyzeCustomCode);
router.post('/code-visualize', aiController.visualizeCode);

// Health check
router.get('/health', aiController.healthCheck);

export default router;
