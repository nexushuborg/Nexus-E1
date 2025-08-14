import { generateToken } from "./auth.controller.js";

export const home = (req, res) => {
    res.send(`<h2>Home</h2><a href="/api/auth/github">Login via GitHub</a>`);
};

export const githubCallback = (req, res) => {
    generateToken(res, req.user._id);
    res.redirect("/api/github/welcome");
};

export const welcome = (req, res) => {
    res.send(`<h2>Welcome to Algologs</h2> <h2>visit profile page :</h2>  <a href="/api/github/profile">My Profile</a>`);
}

export const profile = (req, res) => {
    res.send(`<h2>github username :${req.user.username}</h2><a href="/api/github/logout">Logout</a>`);
};

export const logout = (req, res) => {
    req.logout(() => {
        res.clearCookie("connect.sid");
        res.clearCookie("jwt");
        res.redirect("/api/github/home");
    });
};