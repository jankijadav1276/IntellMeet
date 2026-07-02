import { Response } from "express"
import { AuthRequest } from "../middleware/authMiddleware"
import Recording from "../models/Recording"
import path from "path"
import {
  startRecordingService,
  stopRecordingService,
  getMeetingRecordingsService,
  getRecordingByIdService,
  deleteRecordingService,
  getAllRecordingsService,
} from "../services/recordingService"

export const startRecording = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { meetingId } = req.body

    const user = req.user as any

    const recording =
      await startRecordingService(
        meetingId,
        user._id
      )

    res.status(201).json({
      success: true,
      recording,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server Error",
    })
  }
}

export const stopRecording = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { recordingId } = req.body

    const user = req.user as any

    const recording =
      await stopRecordingService(
        recordingId,
        user._id
      )

    res.status(200).json({
      success: true,
      recording,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server Error",
    })
  }
}

export const getMeetingRecordings = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const meetingId =
      req.params.meetingId as string

    const user = req.user as any

    const recordings =
      await getMeetingRecordingsService(
        meetingId,
        user._id
      )

    res.status(200).json({
      success: true,
      recordings,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server Error",
    })
  }
}

export const getAllRecordings = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = req.user as any

    const recordings =
      await getAllRecordingsService(
        user._id
      )

    res.status(200).json({
      success: true,
      recordings,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server Error",
    })
  }
}

export const getRecordingById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const recordingId =
      req.params.recordingId as string

    const user = req.user as any

    const recording =
      await getRecordingByIdService(
        recordingId,
        user._id
      )

    if (!recording) {
      res.status(404).json({
        success: false,
        message: "Recording not found",
      })
      return
    }

    res.status(200).json({
      success: true,
      recording,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server Error",
    })
  }
}

export const deleteRecording = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const recordingId =
      req.params.recordingId as string

    const user = req.user as any

    const result = await deleteRecordingService(recordingId, user._id)

    if (!result.success) {
      return res.status(result.status || 500).json({
        success: false,
        message: result.message,
      })
    }

    res.status(200).json({
      success: true,
      message:
        "Recording deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server Error",
    })
  }
}

export const uploadRecording = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { recordingId } = req.params

    const recording =
      await Recording.findById(recordingId)

    if (!recording) {
      return res.status(404).json({
        success: false,
        message: "Recording not found",
      })
    }

    const file = (req as any).file

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      })
    }

    recording.videoUrl =
      `/uploads/recordings/${file.filename}`

    await recording.save()

    res.status(200).json({
      success: true,
      recording,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server Error",
    })
  }
}