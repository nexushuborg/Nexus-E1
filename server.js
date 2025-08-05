import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
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

// Passport config
// passportConfig(passport);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

// Express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', gitAuthRoutes);

// Default route (optional)
// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
