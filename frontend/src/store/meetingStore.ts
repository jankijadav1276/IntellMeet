import { create } from "zustand"
import type { Meeting } from "../types"

interface MeetingState {
  meetings: Meeting[]           // list of all meetings
  activeMeeting: Meeting | null // the meeting currently in progress

  // Actions
  setMeetings: (meetings: Meeting[]) => void
  addMeeting: (meeting: Meeting) => void
  setActiveMeeting: (meeting: Meeting | null) => void
  removeMeeting: (id: string) => void
}

const useMeetingStore = create<MeetingState>((set) => ({
  // Initial values
  meetings: [],
  activeMeeting: null,

  // Replace the whole meetings list
  setMeetings: (meetings) => set({ meetings }),

  // Add one new meeting to the list
  addMeeting: (meeting) =>
    set((state) => ({
      meetings: [meeting, ...state.meetings]
    })),

  // Set which meeting is currently active (user is inside)
  setActiveMeeting: (meeting) => set({ activeMeeting: meeting }),

  // Remove a meeting by its ID
  removeMeeting: (id) =>
    set((state) => ({
      meetings: state.meetings.filter((m) => m._id !== id)
    })),
}))

export default useMeetingStore