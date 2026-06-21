import { create } from "zustand"

export interface ChatMessage {
  userId: string
  name: string
  message: string
  timestamp: string
}

export interface TypingUser {
  userId: string
  name: string
}

type ChatStore = {
  messages: ChatMessage[]
  typingUsers: TypingUser[]

  setMessages: (msgs: ChatMessage[]) => void
  addMessage: (msg: ChatMessage) => void

  setTypingUsers: (users: TypingUser[]) => void
  addTypingUser: (user: TypingUser) => void
  removeTypingUser: (userId: string) => void

  clear: () => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  typingUsers: [],

  // ================= MESSAGES =================
  setMessages: (msgs) => set({ messages: msgs }),

  addMessage: (msg) =>
    set((state) => {
      // prevent duplicates (important for socket reconnect)
      const exists = state.messages.some(
        (m) =>
          m.userId === msg.userId &&
          m.message === msg.message &&
          m.timestamp === msg.timestamp
      )

      if (exists) return state

      return {
        messages: [...state.messages, msg],
      }
    }),

  // ================= TYPING =================
  setTypingUsers: (users) => set({ typingUsers: users }),

  addTypingUser: (user) => {
    const current = get().typingUsers

    const exists = current.some((u) => u.userId === user.userId)

    if (!exists) {
      set({ typingUsers: [...current, user] })
    }
  },

  removeTypingUser: (userId) => {
    set((state) => ({
      typingUsers: state.typingUsers.filter(
        (u) => u.userId !== userId
      ),
    }))
  },

  // ================= RESET =================
  clear: () =>
    set({
      messages: [],
      typingUsers: [],
    }),
}))