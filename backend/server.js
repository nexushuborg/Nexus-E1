import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import passport from 'passport';
import session from 'express-session';  // required for the login system to remember users after they sign in
import cookieParser from 'cookie-parser';
import connectDB from './config/connect.js';
import authRoutes from './routes/authRoutes.js';
// import passportConfig from './config/passport.js';
import "./config/gitPassport.js"

import { default as gfgRoute } from "./routes/gfg.js";
import { default as hrRoute } from "./routes/hackerrank.js";
import { default as lcRoute } from "./routes/leetcode.js";

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
app.use(express.text({ type: 'text/html' }));
app.use(cookieParser());

//session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session()); // Enable session support for persistent logins

// Routes
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.use("/gfg", gfgRoute);
app.use("/hackerrank", hrRoute);
app.use("/leetcode", lcRoute);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
