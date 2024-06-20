import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';
import { v2 as cloudinary } from 'cloudinary';

export const getuserProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUser profile:", error.message);
        res.status(500).json({ error: error.message })
    }
}

export const subscribeUnsubscribeUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "you cant subscribe/unsubscribe yourself" })
        }

        if (!userToModify || !currentUser) return res.status(400).json({ error: "user not found" });

        const isSubscribing = currentUser.subscribing.includes(id);

        if (isSubscribing) {
            await User.findByIdAndUpdate(id, { $pull: { subscribers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { subscribing: id } });
            res.status(200).json({ message: "User unsubscribed successfully" });
        } else {
            await User.findByIdAndUpdate(id, { $push: { subscribers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { subscribing: id } });

            const newNotification = new Notification({
                type: "subscribe",
                from: req.user._id,
                to: userToModify._id
            });
            await newNotification.save();

            res.status(200).json({ message: "user subscribed successfully." })
        }

    } catch (error) {
        console.log("error in followUnfollowUser:", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const updateUserProfile = async (req, res) => {
    const { fullname, email, username, currentPassword, newPassword } = req.body;
    let { profileImage, coverImage } = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: "User not found" });

        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ error: "Please provide both current password and new password" })
        }

        
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if(isMatch && currentPassword === newPassword){
                return res.status(400).json({error: "New password should be different than current password"})
            }
            if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "password must be at least 6 characters long" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (profileImage) {
            if(user.profileImage){
                await cloudinary.uploader.destroy(user.profileImage.split("/").pop().split(".")[0]);
            }
            const uploadedResponse = await cloudinary.uploader.upload(profileImage)
            profileImage = uploadedResponse.secure_url;
        }
        if (coverImage) {
            if(user.coverImage){
                await cloudinary.uploader.destroy(user.coverImage.split("/").pop().split(".")[0])
            }
            const uploadedResponse = await cloudinary.uploader.upload(coverImage)
            coverImage = uploadedResponse.secure_url
        }

        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.username = username || user.username
        user.profileImage = profileImage || user.profileImage;
        user.coverImage = coverImage || user.coverImage;

        user = await user.save();
        user.password = null

        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in updateUser:", error.message);
        res.status(500).json({ error: error.message })
    }
}