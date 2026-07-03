import { create } from "zustand"
import type { Analytics } from "../types/analytics"

interface AnalyticsState {
  analytics: Analytics | null

  setAnalytics: (analytics: Analytics) => void

  clearAnalytics: () => void
}

const useAnalyticsStore = create<AnalyticsState>((set) => ({
  // ===============================
  // Initial State
  // ===============================
  analytics: null,

  // ===============================
  // Analytics
  // ===============================
  setAnalytics: (analytics) =>
    set({ analytics }),

  // ===============================
  // Reset
  // ===============================
  clearAnalytics: () =>
    set({
      analytics: null,
    }),
}))

export default useAnalyticsStore