import type { LoginRequest, SignupRequest, AuthResponse } from "../types"
import api from "./api"

const authService = {

  // Call POST /auth/login with email and password
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", data)
    return response.data
  },

  // Call POST /auth/signup with name, email, password
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/signup", data)
    return response.data
  },

  // Call POST /auth/logout
  async logout(): Promise<void> {
    await api.post("/auth/logout")
    localStorage.removeItem("token")
  },

  // Call GET /auth/me to get current logged in user
  async getMe() {
    const response = await api.get("/auth/me")
    return response.data
  },

}

export default authService