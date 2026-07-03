import api from "./api";

const meetingService = {
  // Get logged-in user's meetings
  getMyMeetings: async () => {
    const res = await api.get("/meetings");
    return res.data.meetings;
  },

  // Get all meetings (same endpoint for now)
  getMeetings: async () => {
    const res = await api.get("/meetings");
    return res.data.meetings;
  },

  // Get a single meeting by ID
  getMeetingById: async (id: string) => {
    const res = await api.get(`/meetings/${id}`);
    return res.data.meeting;
  },

  // Get meeting details by meeting code (shared link)
getMeetingByCode: async (meetingCode: string) => {
  const res = await api.get(`/meetings/join/${meetingCode}`);
  return res.data.meeting;
},

  // Create a new meeting
  createMeeting: async (data: {
    title: string;
    description?: string;
    startTime: string;
    duration?: number;
  }) => {
    const res = await api.post("/meetings", data);
    return res.data.meeting;
  },

  // Update a meeting
  updateMeeting: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: string;
      startTime?: string;
      duration?: number;
    }
  ) => {
    const res = await api.put(`/meetings/${id}`, data);
    return res.data.meeting;
  },

  // Delete a meeting
  deleteMeeting: async (id: string) => {
    const res = await api.delete(`/meetings/${id}`);
    return res.data;
  },

  // Join meeting using meeting code
joinMeetingByCode: async (meetingCode: string) => {
  const res = await api.post("/meetings/join", {
    meetingCode,
  });

  return res.data;
},

  // Future Feature: Join Meeting
  joinMeeting: async (id: string) => {
    const res = await api.post(`/meetings/${id}/join`);
    return res.data;
  },

  // Future Feature: Meeting Summary
  getMeetingSummary: async (id: string) => {
    const res = await api.get(`/meetings/${id}/summary`);
    return res.data;
  },

  // AI Processing
processMeetingAI: async (id: string) => {
  const res = await api.post(`/ai/${id}/process`);
  return res.data;
},
};

export default meetingService;