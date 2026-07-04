import mongoose from "mongoose"
import Notification from "../../models/Notification"
import { getIO } from "../../socket/socket"

interface CreateNotificationParams {
  user: mongoose.Types.ObjectId

  sender?: mongoose.Types.ObjectId

  title: string

  message: string

  type:
    | "team_invite"
    | "meeting_invite"
    | "meeting_started"
    | "meeting_ended"
    | "member_added"
    | "member_removed"
    | "recording_ready"
    | "summary_ready"
    | "transcript_ready"
    | "system"

  referenceId?: mongoose.Types.ObjectId

  referenceModel?: string
}

export const createNotification = async ({
  user,
  sender,
  title,
  message,
  type,
  referenceId,
  referenceModel,
}: CreateNotificationParams) => {
  const notification = await Notification.create({
  user,
  sender,
  title,
  message,
  type,
  referenceId,
  referenceModel,
})

const io = getIO()

io.to(user.toString()).emit(
  "notification:new",
  notification
)

return notification
}