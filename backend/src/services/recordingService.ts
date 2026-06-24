import Recording from "../models/Recording"

export const startRecordingService = async (
  meetingId: string,
  userId: string
) => {
  const recording = await Recording.create({
    meetingId,
    createdBy: userId,
    status: "recording",
  })

  return recording
}

export const stopRecordingService = async (
  recordingId: string,
  userId: string
) => {
  const recording = await Recording.findById(recordingId)

  if (!recording) {
    throw new Error("Recording not found")
  }

  if (
    recording.createdBy.toString() !== userId
  ) {
    throw new Error(
      "You are not authorized to stop this recording"
    )
  }

  const duration = Math.floor(
    (Date.now() - recording.createdAt!.getTime()) / 1000
  )

  recording.status = "completed"
  recording.duration = duration

  await recording.save()

  return recording
}

export const getMeetingRecordingsService = async (
  meetingId: string
) => {
  return await Recording.find({
    meetingId,
  })
    .populate("createdBy", "name email")
    .sort({
      createdAt: -1,
    })
}

export const getRecordingByIdService = async (
  recordingId: string
) => {
  return await Recording.findById(
    recordingId
  ).populate(
    "createdBy",
    "name email"
  )
}

export const deleteRecordingService = async (
  recordingId: string,
  userId: string
) => {
  const recording =
    await Recording.findById(recordingId)

  if (!recording) {
    throw new Error("Recording not found")
  }

  if (
    recording.createdBy.toString() !== userId
  ) {
    throw new Error(
      "You are not authorized to delete this recording"
    )
  }

  await recording.deleteOne()

  return true
}