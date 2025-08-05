import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import passportConfig from './config/gitPassport.js';

dotenv.config();
const app = express();

// DB connection
connectDB();

// Passport config
passportConfig(passport);

// CORS
app.use(cors());

// Express body parser
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

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
