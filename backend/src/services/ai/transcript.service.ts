import Meeting from "../../models/Meeting"

export const getTranscript = async (
  meetingId: string
) => {
  const meeting =
    await Meeting.findById(
      meetingId
    ).select("transcript")

  if (!meeting) {
    throw new Error("Meeting not found")
  }

  return meeting.transcript || []
}