import express from "express"
import passport from "passport";
import { githubCallback, home, logout, profile, welcome } from "../controllers/gitAuth.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

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

export default router;
