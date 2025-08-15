import { generateToken } from "./auth.controller.js";

// export const signin = (req, res) => {
//     res.json({
//         loginUrl: `${process.env.BACKEND_URL}/api/github/github`
//     });
// };

export const githubCallback = (req, res) => {
    generateToken(res, req.user._id);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};

// export const welcome = (req, res) => {
//     // Axios will fetch this 
//     res.json({
//         message: "Welcome to Algologs",
//         profileUrl: `${process.env.BACKEND_URL}/api/github/profile`
//     });
// }

export const profile = (req, res) => {
    res.json({
        username: req.user.username,
    });
};

export const logout = (req, res) => {
    req.logout(() => {
        res.clearCookie("connect.sid");
        res.clearCookie("jwt");
        res.json({ message: `logged out successfully` });
    });
};