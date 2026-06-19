import { create } from "zustand"
import type { User } from "../types"

interface AuthState {
  user: User | null
  token: string | null
  setUser: (user: User) => void
  setToken: (token: string) => void
  login: (user: User, token: string) => void
  logout: () => void
  isAuthenticated: () => boolean
}

const getStoredUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  } catch (error) {
    console.error("Failed to load user from storage:", error)
    return null
  }
}

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem("token")
  } catch (error) {
    console.error("Failed to load token from storage:", error)
    return null
  }
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: getStoredUser(),
  token: getStoredToken(),

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user))
    set({ user })
  },

  setToken: (token) => {
    localStorage.setItem("token", token)
    set({ token })
  },

  login: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", token)

    set({
      user,
      token
    })
  },

  logout: () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    set({
      user: null,
      token: null
    })
  },

  isAuthenticated: () => {
    return Boolean(get().token)
  }
}))

export default useAuthStore