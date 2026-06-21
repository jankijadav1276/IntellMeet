import { create } from "zustand"
import type { Meeting, Participant } from "../types"

interface MeetingState {
  // All meetings of logged-in user
  meetings: Meeting[]

  // Meeting currently opened
  activeMeeting: Meeting | null

  // Live participants inside meeting room
  participants: Participant[]

  // Actions
  setMeetings: (meetings: Meeting[]) => void
  addMeeting: (meeting: Meeting) => void
  updateMeeting: (meeting: Meeting) => void
  removeMeeting: (id: string) => void

  setActiveMeeting: (meeting: Meeting | null) => void

  setParticipants: (participants: Participant[]) => void
  addParticipant: (participant: Participant) => void
  removeParticipant: (id: string) => void

  clearMeetingState: () => void
}

const useMeetingStore = create<MeetingState>((set) => ({
  // ===============================
  // Initial State
  // ===============================
  meetings: [],
  activeMeeting: null,
  participants: [],

  // ===============================
  // Meetings
  // ===============================
  setMeetings: (meetings) =>
    set({ meetings }),

  addMeeting: (meeting) =>
  set((state) => {
    const exists = state.meetings.some(
      (m) => m._id === meeting._id
    )

    if (exists) {
      return state
    }

    return {
      meetings: [meeting, ...state.meetings],
    }
  }),

  updateMeeting: (meeting) =>
    set((state) => ({
      meetings: state.meetings.map((m) =>
        m._id === meeting._id ? meeting : m
      ),
    })),

  removeMeeting: (id) =>
    set((state) => ({
      meetings: state.meetings.filter(
        (meeting) => meeting._id !== id
      ),
    })),

  // ===============================
  // Active Meeting
  // ===============================
  setActiveMeeting: (meeting) =>
    set({ activeMeeting: meeting }),

  // ===============================
  // Participants
  // ===============================
  setParticipants: (participants) =>
    set({ participants }),

  addParticipant: (participant) =>
    set((state) => {
      const exists = state.participants.some(
        (p) => p._id === participant._id
      )

      if (exists) {
        return state
      }

      return {
        participants: [
          ...state.participants,
          participant,
        ],
      }
    }),

  removeParticipant: (id) =>
    set((state) => ({
      participants: state.participants.filter(
        (participant) => participant._id !== id
      ),
    })),

  // ===============================
  // Reset Meeting State
  // ===============================
  clearMeetingState: () =>
    set({
      activeMeeting: null,
      participants: [],
    }),
}))

export default useMeetingStore