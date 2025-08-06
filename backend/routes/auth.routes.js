import express from 'express';
import { signup, login, logout, githubCallback } from '../controllers/auth.controller.js';
import passport from 'passport';

const router = express.Router();

// Local Auth
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  githubCallback
);

export default router;