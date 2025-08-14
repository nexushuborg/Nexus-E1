import User from '../models/userSchema.js';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRATION, COOKIE_EXPIRATION } from '../config/constants.js';

// This function generates the token after a successful login
export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: COOKIE_EXPIRATION,
  });
};

// This function logs the user out
export const logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// This is the callback function for GitHub OAuth
export const githubCallback = (req, res) => {
    generateToken(res, req.user._id);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);   // Redirect to the dashboard
};