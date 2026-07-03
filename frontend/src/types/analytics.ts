export interface Analytics {
  totalMeetings: number

  totalMeetingMinutes: number

  totalParticipants: number

  aiSummaries: number

  activeMeetings: number

  completedMeetings: number

  scheduledMeetings: number

  weeklyMeetings: {
    day: string
    meetings: number
  }[]

  monthlyMeetings: {
    month: string
    meetings: number
  }[]
}