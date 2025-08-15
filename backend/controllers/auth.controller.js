import User from '../models/userSchema.js';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRATION, COOKIE_EXPIRATION } from '../config/constants.js';

// Generate JWT token and set cookie
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

// GitHub OAuth callback
export const githubCallback = (req, res) => {
    generateToken(res, req.user._id);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};

// Get authenticated user profile
export const profile = (req, res) => {
    res.json({
        username: req.user.username,
    });
};

// Logout user
export const logout = (req, res) => {
    res.clearCookie("jwt");
    res.json({ message: `logged out successfully` });
};