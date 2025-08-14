import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import gitAuthRoutes from './routes/authRoutes.js';
import path from 'path';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import connectDB from './config/connect.js';
import authRoutes from './routes/auth.routes.js';
// import passportConfig from './config/passport.js';
import "./config/gitPassport.js"


dotenv.config();

const app = express();

// Connect to DB
// Database connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// Passport middleware
app.use(passport.initialize());

// Routes
app.use('/api/github', gitAuthRoutes);
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start server
const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
