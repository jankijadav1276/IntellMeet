import api from "./api"

const recordingService = {
  startRecording: async (
    meetingId: string
  ) => {
    const res = await api.post(
      "/recordings/start",
      {
        meetingId,
      }
    )

    return res.data.recording
  },

  stopRecording: async (
    recordingId: string
  ) => {
    const res = await api.post(
      "/recordings/stop",
      {
        recordingId,
      }
    )

    return res.data.recording
  },

  uploadRecording: async (
    recordingId: string,
    file: Blob
  ) => {
    const formData = new FormData()

    formData.append(
      "video",
      file,
      "recording.webm"
    )

    const res = await api.post(
      `/recordings/upload/${recordingId}`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    )

    return res.data.recording
  },

  getRecordingById: async (
    id: string
  ) => {
    const res = await api.get(
      `/recordings/${id}`
    )

    return res.data.recording
  },

  getRecordingsByMeeting: async (
    meetingId: string
  ) => {
    const res = await api.get(
      `/recordings/meeting/${meetingId}`
    )

    return res.data.recordings
  },

  deleteRecording: async (
    id: string
  ) => {
    const res = await api.delete(
      `/recordings/${id}`
    )

    return res.data
  },
}

export default recordingService