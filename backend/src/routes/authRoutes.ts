import express from "express";

import {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
} from "../controllers/authController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Protected Routes
router.get("/profile", protect, getProfile);
router.get("/me", protect, getProfile);

export default router;