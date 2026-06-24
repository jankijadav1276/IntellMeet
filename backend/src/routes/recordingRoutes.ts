import express from "express"

import { protect } from "../middleware/authMiddleware"
import upload from "../middleware/upload"

import {
  startRecording,
  stopRecording,
  getMeetingRecordings,
  getRecordingById,
  deleteRecording,
  uploadRecording,
} from "../controllers/recordingController"

const router = express.Router()

router.post(
  "/start",
  protect,
  startRecording
)

router.post(
  "/stop",
  protect,
  stopRecording
)

router.get(
  "/meeting/:meetingId",
  protect,
  getMeetingRecordings
)

router.post(
  "/upload/:recordingId",
  protect,
  upload.single("video"),
  uploadRecording
)

router.get(
  "/:recordingId",
  protect,
  getRecordingById
)

router.delete(
  "/:recordingId",
  protect,
  deleteRecording
)

export default router