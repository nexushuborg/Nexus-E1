import express from "express"
import passport from "passport";
import { githubCallback, logout, profile } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";
import jwt from "jsonwebtoken"
import User from "../models/userSchema.js";  // Add this import

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Auth service is running",
        timestamp: new Date().toISOString()
    });
});

// the login button will hit this endpoint 
router.get("/github", passport.authenticate("github", { scope: ['user:email'] }));

// after oauth, it will redirect to the dashboard
router.get("/callback", passport.authenticate("github", { failureRedirect: "/", session: false }), githubCallback);

// profile section will have the authenticated username
router.get("/profile", protect, profile);

// logout button hit this endpoint
router.get("/logout", logout);

// endpoint to exchange the code encoded in the url in return of the github access token
router.post("/exchange-code", async (req, res) => {
    try {
        const { code, redirect_uri } = req.body;

        const params = new URLSearchParams({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
            redirect_uri
        });

        const response = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params
        });

        const tokenData = await response.json();
        if (!tokenData.access_token) {
            return res.status(400).json({ error: "Failed to get access token", details: tokenData });
        }

        // fetch GitHub user profile
        const userResponse = await fetch("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const ghUser = await userResponse.json();

        // Find or create user in database
        let user = await User.findOne({ githubId: ghUser.id });
        if (!user) {
            user = await User.create({
                githubId: ghUser.id,
                username: ghUser.login,
                email: ghUser.email,
                avatar: ghUser.avatar_url,
                bio: ghUser.bio
            });
        }

        // sign JWT with user ID from database
        const jwtToken = jwt.sign(
            { userId: user._id, accessToken: tokenData.access_token },  // Use database user ID
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set cookie with consistent settings
        res.cookie("jwt", jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',  // Match auth controller
            sameSite: 'strict',  // Match auth controller
            maxAge: 3600000  // 1 hour in ms
        });

        // Send response
        res.json({
            success: true,
            message: "Authentication successful",
            accessToken: tokenData.access_token,
            user: {
                id: user._id,
                username: ghUser.login,
                avatarUrl: ghUser.avatar_url,
                email: ghUser.email
            },
            jwt: jwtToken  // Include JWT in response for Postman
        });

    } catch (error) {
        console.error('Exchange code error:', error);
        res.status(500).json({ error: "Something went wrong!", message: error.message });
    }
});

export default router;
