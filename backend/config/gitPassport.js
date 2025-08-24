import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';
import User from '../models/userSchema.js';

dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const githubProfile = {
        githubId: profile.id,
        name: profile.displayName,
        username: profile.username,
      };

      try {
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          return done(null, user);
        }

        user = await User.create(githubProfile);
        return done(null, user);
      } catch (err) {
        console.error('GitHub OAuth error:', err);
        return done(err, null);
      }
    }
  )
);


