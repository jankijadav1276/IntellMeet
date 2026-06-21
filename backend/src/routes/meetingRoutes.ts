import express from "express"
import { protect } from "../middleware/authMiddleware"
import { checkMeetingAccess } from "../middleware/meetingAccessMiddleware"

import {
  createMeeting,
  getMyMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  joinMeetingByCode,
} from "../controllers/meetingController"

const router = express.Router()

// ===============================
// CREATE MEETING
// ===============================
router.post("/", protect, createMeeting)

// ===============================
// JOIN MEETING BY CODE
// ===============================
router.post("/join", protect, joinMeetingByCode)

// ===============================
// GET MY MEETINGS
// ===============================
router.get("/", protect, getMyMeetings)

// ===============================
// GET SINGLE MEETING
// ===============================
router.get("/:id", protect, checkMeetingAccess, getMeetingById)

// ===============================
// UPDATE MEETING
// ===============================
router.put("/:id", protect, updateMeeting)

// ===============================
// DELETE MEETING
// ===============================
router.delete("/:id", protect, deleteMeeting)

export default router