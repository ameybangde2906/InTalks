import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getuserProfile, subscribeUnsubscribeUser, updateUserProfile } from "../controllers/user.controller.js";

const router=express.Router();

router.get("/profile/:id", getuserProfile);
router.post("/subscribe/:id",protectRoute,subscribeUnsubscribeUser)
router.post('/update', protectRoute, updateUserProfile)

export default router;