import express from "express"
import { protect } from "../middleware/authMiddleware"
import { checkMeetingAccess } from "../middleware/meetingAccessMiddleware"

import {
  createMeeting,
  getMyMeetings,
  getMeetingById,
  getMeetingByCode,
  updateMeeting,
  deleteMeeting,
  joinMeetingByCode,
  updateTranscript,
} from "../controllers/meetingController"

const router = express.Router()

// ===============================
// CREATE MEETING
// ===============================
router.post("/", protect, createMeeting)

// ===============================
// GET MEETING BY LINK
// ===============================
router.get(
  "/join/:meetingCode",
  protect,
  getMeetingByCode
)

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
// SAVE TRANSCRIPT
// ===============================
router.put(
  "/:id/transcript",
  protect,
  updateTranscript
)
// ===============================
// DELETE MEETING
// ===============================
router.delete("/:id", protect, deleteMeeting)

export default router