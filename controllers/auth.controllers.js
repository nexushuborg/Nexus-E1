export const home = (req, res) => {
    res.send(`<h2>Home</h2><a href="/auth/github">Login via GitHub</a>`);
};

export const githubAuth = (req, res) => {
    // Handled by passport.authenticate middleware
};

export const githubCallback = (req, res) => {
    res.redirect("/profile");
};

export const profile = (req, res) => {
    if (!req.isAuthenticated()) return res.redirect("/");
    res.send(`<h2>Hello, ${req.user.username}</h2><a href="/logout">Logout</a>`);
};

export const logout = (req, res) => {
    req.logout(() => {
        res.clearCookie("connect.sid");
        res.clearCookie("jwt");
        res.redirect("/");
    });
};
