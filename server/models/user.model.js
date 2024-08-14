import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    googleId: {
        type: String,
        unique: true
    },
    fullname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId; // Password is required only if googleId is not present
        },
        minLength: 6,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    subscribers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    subscribing: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    profileImage: {
        type: String,
        default: null,
    },
    coverImage: {
        type: String,
        default: null,
    },
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Upload",
            default: []
        },
    ],
    savedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Upload",
            default: []
        }
    ],
}, { timestamps: true })

const User = mongoose.model("User", userSchema);

export default User;