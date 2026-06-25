export interface Recording {
  _id: string

  meetingId: string

  videoUrl: string

  duration: number

  status: "recording" | "completed"

  createdAt: string
  updatedAt: string
}