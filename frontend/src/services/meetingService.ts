import api from "./api";

const meetingService = {

  getMeetings: async () => {
    const res = await api.get("/meetings");
    return res.data;
  },

  getMeetingById: async (id: string) => {
    const res = await api.get(`/meetings/${id}`);
    return res.data;
  },

  createMeeting: async (data: any) => {
    const res = await api.post("/meetings", data);
    return res.data;
  },

  updateMeeting: async (id: string, data: any) => {
    const res = await api.put(`/meetings/${id}`, data);
    return res.data;
  },

  deleteMeeting: async (id: string) => {
    const res = await api.delete(`/meetings/${id}`);
    return res.data;
  },

  joinMeeting: async (id: string) => {
    const res = await api.post(`/meetings/${id}/join`);
    return res.data;
  },

  getMeetingSummary: async (id: string) => {
    const res = await api.get(`/meetings/${id}/summary`);
    return res.data;
  }

};

export default meetingService;