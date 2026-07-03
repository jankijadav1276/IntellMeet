import api from "./api";

export const processMeetingAI = async (meetingId: string) => {
  const response = await api.post(`/ai/${meetingId}/process`);
  return response.data;
};