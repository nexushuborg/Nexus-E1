import { generateToken } from "./auth.controller.js";

export const home = (req, res) => {
    res.send(`<h2>Home</h2><a href="/api/auth/github">Login via GitHub</a>`);
};

export const githubCallback = (req, res) => {
    generateToken(res, req.user._id);
    res.redirect((process.env.FRONTEND_URL || 'http://localhost:8080') + "/dashboard");
};

export const welcome = (req, res) => {
    res.send(`<h2>Welcome to Algologs</h2> <h2>visit profile page :</h2>  <a href="/api/github/profile">My Profile</a>`);
}

export const profile = (req, res) => {
    if (req.user) {
        res.status(200).json({ user: req.user });
    } else {
        res.status(401).json({ message: "Not authenticated" });
    }
};

export const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Error logging out" });
        }
        res.clearCookie("connect.sid");
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logged out successfully" });
    });
};