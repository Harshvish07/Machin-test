import express from "express";
import {
  signup,
  login,
  logout,
  onboard,
  getProfile,
  updateProfile
} from "../controller/user.js";

import { protect } from "../middlewares/authMiddleware.js"; // For protecting onboard route

const router = express.Router();

// Public Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Protected Route (only accessible when user is logged in)
router.post("/onboard", protect, onboard);

export default router;
