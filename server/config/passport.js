import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from "../models/user.model.js"
import dotenv from "dotenv"

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/api/auth/google/callback',
    scope:['profile','email']
},

async (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    try {
        // Check if the user already exists in your database
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // If not, create a new user
            user = new User({
                googleId: profile.id,
                username:profile.displayName,
                fullname: profile.displayName,
                email: profile.emails[0].value,
                profileImage: profile.photos[0].value,
            });
            await user.save();
        }

        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
