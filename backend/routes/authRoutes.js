import express from "express"
import passport from "passport";
import { githubCallback, logout, profile } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";
import jwt from "jsonwebtoken"

const router = express.Router();

// test endpoint
// router.get("/signin", signin);

// the login button will hit this endpoint 
router.get("/github", passport.authenticate("github", { scope: ['user:email'] }));

// after oauth, it will redirect to the dashboard
router.get("/callback", passport.authenticate("github", { failureRedirect: "/", session: false }), githubCallback);

// test endpoint
// router.get("/welcome", welcome)

// profile section will have the authenticated username
router.get("/profile", protect, profile);

// logout button hit this endpoint
router.get("/logout", logout);

// endpoint to exchange the code ecnoded in the url in return of the github access token
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
        console.log(tokenData.access_token);
        if (!tokenData.access_token) {
            return res.status(400).json({ error: "Failed to get access token", details: tokenData });
        }

        // fetch GitHub user profile
        const userResponse = await fetch("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const ghUser = await userResponse.json();

        // sign JWT
        const jwtToken = jwt.sign(
            {
                sub: ghUser.id,
                username: ghUser.login,
                avatarUrl: ghUser.avatar_url,
                scopes: tokenData.scope,
                accessToken: tokenData.access_token
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        //sends back everything to background.js
        res.json({
            repos: ghUser.repos,
            accessToken: tokenData.access_token,
            jwt: jwtToken,
            username: ghUser.login,
            avatarUrl: ghUser.avatar_url,
            scopes: tokenData.scope
        });

    } catch (error) {
        console.error("Error exchanging code:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
