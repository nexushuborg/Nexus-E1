import express from "express"
import passport from "passport";
import { githubCallback, home, logout, profile, welcome } from "../controllers/gitAuth.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get("/home", home);
router.get("/github", passport.authenticate("github", { scope: ['user:email'] }));
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/", session: false }), githubCallback);
router.get("/welcome", welcome)
router.get("/profile", protect, profile);
router.get("/logout", logout);

export default router;
