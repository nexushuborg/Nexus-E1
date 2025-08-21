import express from 'express';
import aiController from '../controllers/ai.controller.js';
import { protect } from '../middlewares/auth.middlewares.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Code analysis routes
router.post('/analyze', aiController.analyzeCustomCode);
router.post('/code-analyze', aiController.analyzeCode);

// Health check
router.get('/health', aiController.healthCheck);

export default router;
