// ===============================
// PARTICIPANTS
// ===============================
export interface Participant {
  _id: string
  name: string
  email?: string
  avatar?: string
}
//================================
// WAITING PARTICIPANTS
// ===============================
export interface WaitingParticipant {
  user: string

  name: string

  joinedAt: string
}

export interface WaitingRoomUpdate {
  waitingParticipants: WaitingParticipant[]
}

// ===============================
// CHAT MESSAGE
// ===============================
export interface ChatMessage {
  _id: string
  sender: {
    _id: string
    name: string
  }

  text: string
  time: string
}

// ===============================
// ACTION ITEMS (AI SUMMARY)
// ===============================
export interface ActionItem {
  _id?: string
  task: string
  assignee?: string
  status?: string
  done?: boolean
}

// ===============================
// MEETING SUMMARY
// ===============================
export interface MeetingSummary {
  summary: string
  transcript?: string
  actionItems?: ActionItem[]
}

// ===============================
// MAIN MEETING TYPE
// ===============================
export interface Meeting {
  _id: string

  title: string
  description?: string

  host: {
    _id: string
    name: string
    email?: string
  }

  participants: Participant[]

  meetingCode: string

  status: "scheduled" | "active" | "completed"

  startTime: string
  endTime?: string

  duration: number

  createdAt: string
  updatedAt: string

  summary?: string
  transcript?: string
  actionItems?: ActionItem[]
}

// ===============================
// CREATE MEETING REQUEST
// ===============================
export interface CreateMeetingRequest {
  title: string
  description?: string

  startTime: string
  duration: number
}

// ===============================
// UPDATE MEETING REQUEST
// ===============================
export interface UpdateMeetingRequest {
  title?: string
  description?: string

  startTime?: string
  duration?: number

  status?: "scheduled" | "active" | "completed"
}

// ===============================
// CREATE MEETING RESPONSE
// ===============================
export interface CreateMeetingResponse {
  success: boolean
  message: string
  meeting: Meeting
}

// ===============================
// GET MEETINGS RESPONSE
// ===============================
export interface MeetingsResponse {
  success: boolean
  count: number
  meetings: Meeting[]
}

// ===============================
// SINGLE MEETING RESPONSE
// ===============================
export interface MeetingResponse {
  success: boolean
  meeting: Meeting
}