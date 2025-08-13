import express from "express"
import passport from "passport";
import { githubCallback, home, logout, profile } from "../controllers/gitAuth.controller.js";

const router = express.Router();

router.get("/home", home);
router.get("/github", passport.authenticate("github", { scope: ['user:email'] }));
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/" }),githubCallback);
router.get("/profile", profile);
router.get("/logout", logout);

export default router;

