import { generateTokenAndSetCookie } from "../lib/generateToken.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signUp = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.staus(400).json({ error: "Username is already taken" })
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already" })
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 8 characters long " })
        }

        // if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+-=[]{}|;:,.<>?]).{8,}$/)) {
        //     return res.status(400).json({ error: 'Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long.' });
        // }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashPassword
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImage,
                coverImg: newUser.coverImage
            })
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.log("error in signup controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" })
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            userName: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImage,
            coverImg: user.coverImage
        })
    } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: " logged out successfully" })
    } catch (error) {
        console.log("error in logout controller", error.message);
        res.status(500).json({ error: "internal server error" })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("error in getMe controller", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}

// export const generateOTP = async (req, res) => {
//     try {
//         const { email } = req.body;
//         const user= await User.findById(req.user._id)
//         if(!user){
//             res.status(200).json({error:"User email does not found"})
//         }

//         if(user){
//             const verifyOTP={
//                 to:email,
//                 subject: "Account verification OTP",
//                 html:``
//             }
//         }
        
//     } catch (error) {

//     }
// }
