import api from "./api"

const authService = {
  login: async (data: any) => {
    const response = await api.post("/auth/login", data)
    return response.data
  },

  register: async (data: any) => {
    const response = await api.post("/auth/register", data)
    return response.data
  },

  logout: async () => {
    const response = await api.post("/auth/logout")
    return response.data
  },
}

export default authService