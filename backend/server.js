import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import gitAuthRoutes from './routes/authRoutes.js';
import path from 'path';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import connectDB from './config/connect.js';
import authRoutes from './routes/auth.routes.js';
import aiRoutes from './routes/ai.routes.js';

// import passportConfig from './config/passport.js';
import "./config/gitPassport.js"

import { default as gfgRoute } from "./routes/gfg.js";
import { default as hrRoute } from "./routes/hackerrank.js";
import { default as lcRoute } from "./routes/leetcode.js";

dotenv.config();

const app = express();

// Connect to DB
connectDB();

// Session configuration (for AI features)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.text({ type: 'text/html' }));
app.use(cookieParser());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/github', gitAuthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Platform routes
app.use("/gfg", gfgRoute);
app.use("/hackerrank", hrRoute);
app.use("/leetcode", lcRoute);

// Default route
app.get('/', (req, res) => {
  res.send('Nexus-E1 Backend API - Gemini AI Integrated');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
const PORT = process.env.BACKEND_PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🤖 Gemini AI integration: ${process.env.GEMINI_API_KEY ? 'ENABLED' : 'DISABLED'}`);
});
