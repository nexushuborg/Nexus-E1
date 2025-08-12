export const home = (req, res) => {
    res.send(`<h2>Home</h2><a href="/api/auth/github">Login via GitHub</a>`);
};

export const githubCallback = (req, res) => {
    res.redirect("/api/github/profile");
};

export const profile = (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/");
    res.send(`<h2>Hello, ${req.user.username}</h2><a href="/api/github/logout">Logout</a>`);
};

export const logout = (req, res) => {
    req.logout(() => {
        res.clearCookie("connect.sid");
        res.clearCookie("jwt");
        res.redirect("/api/github/home");
    });
};
