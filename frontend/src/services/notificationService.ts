import api from "./api"

const getNotifications = async () => {
  const { data } = await api.get("/notifications")
  return data.notifications
}

const markAsRead = async (id: string) => {
  const { data } = await api.patch(`/notifications/${id}/read`)
  return data
}

const markAllAsRead = async () => {
  const { data } = await api.patch("/notifications/read-all")
  return data
}

const clearNotifications = async () => {
  const { data } = await api.delete(
    "/notifications/clear-all"
  )

  return data
}

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearNotifications,
}