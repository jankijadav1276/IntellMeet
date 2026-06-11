import type { Meeting, CreateMeetingRequest } from "../types"
import api from "./api"

const meetingService = {

  // Get all meetings for the logged in user
  async getAllMeetings(): Promise<Meeting[]> {
    const response = await api.get<Meeting[]>("/meetings")
    return response.data
  },

  // Get one meeting by its ID
  async getMeetingById(id: string): Promise<Meeting> {
    const response = await api.get<Meeting>(`/meetings/${id}`)
    return response.data
  },

  // Create a new meeting
  async createMeeting(data: CreateMeetingRequest): Promise<Meeting> {
    const response = await api.post<Meeting>("/meetings", data)
    return response.data
  },

  // Delete a meeting
  async deleteMeeting(id: string): Promise<void> {
    await api.delete(`/meetings/${id}`)
  },

  // Get AI summary of a completed meeting
  async getMeetingSummary(id: string) {
    const response = await api.get(`/meetings/${id}/summary`)
    return response.data
  },

}

export default meetingService