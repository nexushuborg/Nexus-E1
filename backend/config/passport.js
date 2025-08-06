import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/userSchema.js';

export default function (passport) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            githubId: profile.id,
            name: profile.displayName,
            username: profile.username
        }

        try {
            let user = await User.findOne({ githubId: profile.id });

            if (user) {
                done(null, user);
            } else {
                user = await User.create(newUser);
                done(null, user);
            }
        } catch (err) {
            console.error(err);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });
}