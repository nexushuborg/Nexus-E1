import dotenv from 'dotenv/config';
// env variables validation
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is required but not set!');
  process.exit(1);
}
import express from 'express';
import cors from 'cors';
import gitAuthRoutes from './routes/authRoutes.js';
import path from 'path';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import connectDB from './config/connect.js';
import aiRoutes from './routes/ai.routes.js';

// import passportConfig from './config/passport.js';
import "./config/gitPassport.js"

const app = express();

// Connect to DB
connectDB();


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

// Routes
app.use('/api/auth', gitAuthRoutes);
app.use('/api/ai', aiRoutes);

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
  console.log(` Server running on http://localhost:${PORT}`);
});
