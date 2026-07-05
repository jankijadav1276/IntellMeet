import { useNavigate } from "react-router-dom"
import useAuthStore from "../store/authStore"
import authService from "../services/authService"
import type { LoginRequest, SignupRequest } from "../types"

export function useAuth() {
  const navigate = useNavigate()
  const { user, token, login, logout, isAuthenticated } = useAuthStore()

  // Called when user submits login form
  async function handleLogin(data: LoginRequest) {
    try {
      // This will call the real backend when ready
      // For now it will fail since backend isn't running
      // so we use fake data below as fallback
      const response = await authService.login(data)
      login(response.user, response.token)
      navigate("/dashboard")
    } catch (error) {
      // If backend not ready, use fake data temporarily
      console.log("Backend not ready, using fake login")
      login(
        {
          _id: "1",
          name: "John Doe",
          email: data.email,
          role: "member",
          createdAt: new Date().toISOString()
        },
        "temp-token"
      )
      navigate("/dashboard")
    }
  }

  // Called when user submits signup form
  async function handleSignup(data: SignupRequest) {
    try {
      const response = await authService.register(data)
      login(response.user, response.token)
      navigate("/dashboard")
    } catch (error) {
      // Fallback fake data
      console.log("Backend not ready, using fake signup")
      login(
        {
          _id: "1",
          name: data.name,
          email: data.email,
          role: "member",
          createdAt: new Date().toISOString()
        },
        "temp-token"
      )
      navigate("/dashboard")
    }
  }

  // Called when user clicks logout
  async function handleLogout() {
    try {
      await authService.logout()
    } catch (error) {
      // Even if backend fails, still log out locally
      console.log("Logout error:", error)
    } finally {
      // finally always runs — clears store and redirects
      logout()
     navigate("/", { replace: true })
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    handleLogin,
    handleSignup,
    handleLogout,
  }
}