import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import connectDB from './config/connect.js';
import authRoutes from './routes/auth.routes.js';
import passportConfig from './config/passport.js';


dotenv.config();
const app = express();

// Database connection
connectDB();

// Passport config
passportConfig(passport);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

const PORT = process.env.PORT || 3000;

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
