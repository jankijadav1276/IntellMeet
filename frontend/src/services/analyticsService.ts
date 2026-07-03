import api from "./api";

export interface AnalyticsResponse {
  totalMeetings: number;

  totalMeetingMinutes: number;

  totalParticipants: number;

  aiSummaries: number;

  activeMeetings: number;

  completedMeetings: number;

  scheduledMeetings: number;

  weeklyMeetings: {
    day: string;
    meetings: number;
  }[];

  monthlyMeetings: {
    month: string;
    meetings: number;
  }[];
}

interface ApiResponse {
  success: boolean;
  data: AnalyticsResponse;
}

export const getAnalytics = async (): Promise<AnalyticsResponse> => {
  const response = await api.get<ApiResponse>("/analytics");

  return response.data.data;
};