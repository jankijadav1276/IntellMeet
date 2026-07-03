import express from "express";
import rateLimit from "express-rate-limit";
import {
  generateMeetingSummary,
  generateMeetingActionItems,
  processMeetingAI,
} from "../controllers/ai.controller";
import { protect } from "../middleware/authMiddleware";
import { checkMeetingAccess } from "../middleware/meetingAccessMiddleware"; // Matches your exported function name

const router = express.Router();

/**
 * Production Guard: Limit hits to AI endpoints to protect your API quota/wallet
 */
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 AI requests per window
  message: { message: "Too many AI requests from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Enforce authentication & rate limiting across all endpoints below
router.use(protect);
router.use(aiLimiter);

/**
 * Note: The route paths use '/:id/summary' so that 'checkMeetingAccess'
 * can properly extract the meeting ID using 'req.params.id'.
 */
router.post("/:id/summary", checkMeetingAccess, generateMeetingSummary);
router.post("/:id/action-items", checkMeetingAccess, generateMeetingActionItems);
router.post("/:id/process",checkMeetingAccess,processMeetingAI);

export default router;