import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import passportConfig from './config/passport.js';

dotenv.config();

const app = express();

// Connect to DB
connectDB();

// Passport config
passportConfig(passport);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
app.use('/api/auth', authRoutes);

// Default route (optional)
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
