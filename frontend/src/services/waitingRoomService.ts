import api from "./api"

const approveParticipant = async (
  meetingId: string,
  userId: string
) => {
  const { data } = await api.post(
    `/meetings/${meetingId}/waiting-room/approve`,
    {
      userId,
    }
  )

  return data
}

const rejectParticipant = async (
  meetingId: string,
  userId: string
) => {
  const { data } = await api.post(
    `/meetings/${meetingId}/waiting-room/reject`,
    {
      userId,
    }
  )

  return data
}

export default {
  approveParticipant,
  rejectParticipant,
}