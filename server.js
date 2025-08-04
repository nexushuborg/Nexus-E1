import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/connect.js';
import authRouter from "./routes/authRoute.js"
import session from 'express-session';
import passport from 'passport';
import "./config/passport.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// connectDB();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
