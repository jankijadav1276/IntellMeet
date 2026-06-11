import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import useAuthStore from "../store/authStore"

export function useSocket(meetingId?: string) {
  // useRef stores the socket instance without causing re-renders
  const socketRef = useRef<Socket | null>(null)
  const { token } = useAuthStore()

  useEffect(() => {
    // Only connect if we have a token
    if (!token) return

    // Create socket connection to backend
    const socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        token  // sends token so backend knows who this is
      }
    })

    // Save socket to ref so other functions can use it
    socketRef.current = socket

    // These are connection lifecycle events
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id)

      // If a meetingId was passed, join that meeting room
      if (meetingId) {
        socket.emit("join-room", { meetingId })
      }
    })

    socket.on("disconnect", () => {
      console.log("Socket disconnected")
    })

    socket.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message)
    })

    // Cleanup — disconnect when component unmounts
    // This prevents memory leaks
    return () => {
      if (meetingId) {
        socket.emit("leave-room", { meetingId })
      }
      socket.disconnect()
    }
  }, [token, meetingId])
  // The array at the end means: re-run this effect
  // only when token or meetingId changes

  // Function to send a message in a meeting
  function sendMessage(text: string) {
    if (socketRef.current) {
      socketRef.current.emit("message:send", {
        meetingId,
        text
      })
    }
  }

  // Function to listen for any socket event
  // Used in meeting room to listen for new messages etc
  function onEvent(event: string, callback: (data: unknown) => void) {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }
  }

  // Function to stop listening to an event
  function offEvent(event: string) {
    if (socketRef.current) {
      socketRef.current.off(event)
    }
  }

  return {
    socket: socketRef.current,
    sendMessage,
    onEvent,
    offEvent,
  }
}