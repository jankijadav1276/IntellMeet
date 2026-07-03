import { Response, NextFunction } from "express"
import Meeting from "../models/Meeting"
import { AuthRequest } from "./authMiddleware"

export const checkMeetingAccess = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user as any
    const meetingId = req.params.id

    const meeting = await Meeting.findById(meetingId)

          if (!user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        })
        return
      }

    if (!meeting) {
      res.status(404).json({
        success: false,
        message: "Meeting not found",
      })
      return
    }

    const isHost = meeting.host.toString() === user._id.toString()

    const isParticipant = meeting.participants.some(
      (p: any) => p.user?.toString() === user._id.toString()
    )
    if (!isHost && !isParticipant) {
      res.status(403).json({
        success: false,
        message: "Access denied to this meeting",
      })
      return
    }

    // attach meeting for next use
    req.meeting = meeting

    next()
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}