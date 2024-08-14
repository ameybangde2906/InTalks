import express from "express";
import { getMe, login, logout, signUp } from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/protectRoute.js";
import passport from "passport";
import { generateTokenAndSetCookie } from "../lib/generateToken.js";

const router = express.Router()

router.get("/me", protectRoute, getMe)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:3000' }), 
(req, res) => {
    // On success, generate token and set cookie
    generateTokenAndSetCookie(req.user._id, res);
    res.redirect('http://localhost:3000'); // Redirect to homepage or dashboard
});


router.post("/signup", signUp)
router.post("/login", login)
router.post("/logout", logout)

export default router;