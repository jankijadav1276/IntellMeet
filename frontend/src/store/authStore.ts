import { create } from "zustand"
import type { User } from "../types"

interface AuthState {
  user: User | null
  token: string | null

  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  login: (user: User, token: string) => void
  logout: () => void
  isAuthenticated: () => boolean
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),

  setUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
    set({ user })
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token)
    } else {
      localStorage.removeItem("token")
    }
    set({ token })
  },

  login: (user, token) => {
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", token)
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    set({ user: null, token: null })
  },

  isAuthenticated: () => {
    return !!get().token && !!get().user
  },
}))

export default useAuthStore