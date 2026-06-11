// One participant inside a meeting
export interface Participant {
  _id: string
  name: string
  avatar?: string
  isMuted: boolean
  isVideoOff: boolean
  isHost: boolean
}

// A single chat message
export interface ChatMessage {
  _id: string
  sender: string
  text: string
  time: string
}

// A full meeting object
export interface Meeting {
  _id: string
  title: string
  hostId: string
  participants: Participant[]
  date: string
  duration: string
  status: "upcoming" | "live" | "completed"
  summary?: string          // only exists after meeting ends
  transcript?: string       // only exists after meeting ends
  actionItems?: ActionItem[]
}

// An action item extracted by AI after meeting
export interface ActionItem {
  _id: string
  text: string
  assignee: string
  dueDate?: string
  done: boolean
}

// What we send to backend to create a new meeting
export interface CreateMeetingRequest {
  title: string
  date: string
  time: string
}