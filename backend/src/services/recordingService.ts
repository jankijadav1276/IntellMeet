import Recording from "../models/Recording"
import Meeting from "../models/Meeting"

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
  meetingId: string,
  userId: string
) => {
  return await Recording.find({
  meetingId,
  hiddenFor: {
    $ne: userId,
  },
})
    .populate("createdBy", "name email")
    .sort({
      createdAt: -1,
    })
}

export const getRecordingByIdService = async (
  recordingId: string,
  userId: string
) => {
  return await Recording.findOne({
    _id: recordingId,
    hiddenFor: {
      $ne: userId,
    },
  }).populate(
    "createdBy",
    "name email"
  )
}

export const deleteRecordingService = async (
  recordingId: string,
  userId: string
) => {
  const recording = await Recording.findById(recordingId)

  if (!recording) {
    return {
      success: false,
      status: 404,
      message: "Recording not found",
    }
  }

  const meeting = await Meeting.findById(recording.meetingId)

  if (!meeting) {
    return {
      success: false,
      status: 404,
      message: "Meeting not found",
    }
  }

  // If the logged-in user is the meeting host,
  // permanently delete the recording for everyone.
  if (meeting.host.toString() === userId) {
    await recording.deleteOne()

    return {
      success: true,
      deletedForEveryone: true,
    }
  }

  // Otherwise, hide the recording only for this user.
  await Recording.findByIdAndUpdate(
    recordingId,
    {
      $addToSet: {
        hiddenFor: userId,
      },
    }
  )

  return {
    success: true,
    deletedForEveryone: false,
  }
}

export const getAllRecordingsService =
  async (userId: string) => {
    return await Recording.find({
  hiddenFor: {
    $ne: userId,
  },
})
      .populate(
        "createdBy",
        "name email"
      )
      .sort({
        createdAt: -1,
      })
  }