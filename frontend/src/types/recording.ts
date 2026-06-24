export interface Recording {
  _id: string
  title: string
  meetingId: string

  status: "processing" | "completed" | "failed"

  duration?: number

  recordingUrl?: string
  downloadUrl?: string

  summary?: string
  transcript?: string

  createdAt: string
  updatedAt?: string
}

export interface RecordingResponse {
  success: boolean
  recording: Recording
}

export interface RecordingsResponse {
  success: boolean
  recordings: Recording[]
}