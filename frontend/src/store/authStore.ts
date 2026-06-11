import { create } from "zustand"
import type { User } from "../types"

// This defines the shape of your auth store
// What data it holds and what actions it can do
interface AuthState {
  user: User | null        // null means not logged in
  token: string | null     // the JWT token

  // Actions — functions that update the store
  setUser: (user: User) => void
  setToken: (token: string) => void
  login: (user: User, token: string) => void
  logout: () => void
  isAuthenticated: () => boolean
}

const useAuthStore = create<AuthState>((set, get) => ({
  // Initial values — read from localStorage so user stays
  // logged in even after page refresh
  user: null,
  token: localStorage.getItem("token"),

  // Just update the user
  setUser: (user) => set({ user }),

  // Just update the token
  setToken: (token) => {
    localStorage.setItem("token", token)
    set({ token })
  },

  // Called after successful login — saves both user and token
  login: (user, token) => {
    localStorage.setItem("token", token)
    set({ user, token })
  },

  // Called on logout — clears everything
  logout: () => {
    localStorage.removeItem("token")
    set({ user: null, token: null })
  },

  // Returns true if user is logged in
  // get() reads the current state
  isAuthenticated: () => {
    return get().token !== null
  },
}))

export default useAuthStore