import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import useAuthStore from "../store/authStore"
import { useChatStore } from "../store/chatStore"
import { useQueryClient } from "@tanstack/react-query"

export interface ChatMessage {
  userId: string
  name: string
  message: string
  timestamp: string
}

export function useSocket(meetingId?: string, autoJoin = true) {
  const socketRef = useRef<Socket | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)

  const { token, user } = useAuthStore()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!token) return

    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    })
    setSocket(newSocket)
    socketRef.current = newSocket


    // ================= CONNECT =================
    newSocket.on("connect", () => {
      console.log("✅ connected:", newSocket.id)
      console.log("autoJoin =", autoJoin)

      console.log("meetingId =", meetingId)

      console.log("Current page =", window.location.pathname)

      console.log("✅ connected:", newSocket.id)
      if (autoJoin && meetingId && user?._id) {
        newSocket.emit("join-room", {
          meetingId,
          userId: user._id,
          name: user.name,
        })
      }
    })
    // ================= CHAT HISTORY =================
    newSocket.on("chat-history", (messages: ChatMessage[]) => {
      useChatStore.getState().setMessages(messages)
    })

    newSocket.on("receiveMessage", (msg: ChatMessage) => {
      useChatStore.getState().addMessage(msg)
    })

    newSocket.on("typing", (data: any) => {
      if (data?.name) {
        useChatStore.getState().addTypingUser(data.name)
      }
    })

    newSocket.on("stop-typing", (data: any) => {
      if (data?.name) {
        useChatStore.getState().removeTypingUser(data.name)
      }
    })

    // ================= ROOM UPDATE =================
    newSocket.on("room-update", () => { })

    // ================= FORCE MUTE (NEW) =================
    newSocket.on("force-mute", () => {
      console.log("🔇 You were muted by host")
      // You should update your UI state here
    })

    // ================= ACTIVE SPEAKER (NEW) =================
    newSocket.on("active-speaker", (data) => {
      // data: { socketId, level }
      // Use this to highlight active speaker UI
      console.log("🎤 active speaker:", data)
    })

    // ================= HAND UPDATE (NEW) =================
    newSocket.on("hand-update", (data) => {
      // data: { participants, raisedBy }
      console.log("✋ hand update:", data)
    })

    // ================= USER LEFT (NEW) =================
    newSocket.on("user-left", (data) => {
      // data: { socketId }
      console.log("🚪 user left:", data)
    })

    //========notifications========
    newSocket.on("new-notification", (notification) => {
      console.log("🔔 New notification:", notification)

      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      })
    })
    // ================= CLEANUP =================
    return () => {
      newSocket.off("connect")
      newSocket.off("chat-history")
      newSocket.off("room-update")
      newSocket.off("force-mute")
      newSocket.off("active-speaker")
      newSocket.off("hand-update")
      newSocket.off("user-left")
      newSocket.off("new-notification")
      newSocket.off("user-reconnecting")
      newSocket.off("system-message")
      newSocket.off("typing")
      newSocket.off("stop-typing")

      if (meetingId) {
        newSocket.emit("leaveMeeting", { meetingId })
      }

      newSocket.disconnect()
      socketRef.current = null
      setSocket(null)
    }
  }, [token, meetingId, user?._id])

  // ================= CHAT =================
  const sendMessage = (message: string) => {
    if (!meetingId || !user) return

    const msg: ChatMessage = {
      userId: user._id,
      name: user.name,
      message,
      timestamp: new Date().toISOString(),
    }

    // 1. optimistic UI update
    useChatStore.getState().addMessage(msg)

    // 2. emit to server
    socketRef.current?.emit("sendMessage", {
      meetingId,
      ...msg,
    })
  }

  const startTyping = () => {
    socketRef.current?.emit("typing", {
      meetingId,
      userId: user?._id,
      name: user?.name,
    })
  }

  const stopTyping = () => {
    socketRef.current?.emit("stop-typing", {
      meetingId,
      userId: user?._id,
    })
  }

  // ================= HAND RAISE =================
  const raiseHand = (raised: boolean) => {
    socketRef.current?.emit("raise-hand", {
      raised,
      userId: user?._id,
      name: user?.name,
    })
  }

  // ================= AUDIO LEVEL =================
  const sendAudioLevel = (level: number) => {
    socketRef.current?.emit("audio-level", { level })
  }

  // ================= MEDIA =================
  const updateMediaState = (micOn: boolean, cameraOn: boolean) => {
    socketRef.current?.emit("media-state", {
      micOn,
      cameraOn,
    })
  }

  // ================= HOST ACTIONS =================
  const muteUser = (targetSocketId: string) => {
    socketRef.current?.emit("mute-user", { targetSocketId })
  }

  const removeUser = (targetSocketId: string) => {
    socketRef.current?.emit("remove-user", { targetSocketId })
  }

  const transferHost = (newHostUserId: string) => {
    socketRef.current?.emit("transfer-host", {
      meetingId,
      newHostUserId,
    })
  }

  const endMeeting = () => {
    socketRef.current?.emit("end-meeting")
  }

  // ================= LEAVE =================
  const leaveMeeting = () => {
    socketRef.current?.emit("leaveMeeting", { meetingId })
  }

  const requestJoinWaitingRoom = () => {
    if (!meetingId || !user) return

    socketRef.current?.emit("join-waiting-room", {
      meetingId,
      userId: user._id,
      name: user.name,
    })
  }

  // ================= EVENTS =================
  const onChatHistory = (cb: (m: ChatMessage[]) => void) =>
    socketRef.current?.on("chat-history", cb)

  const onReceiveMessage = (cb: (m: ChatMessage) => void) =>
    socketRef.current?.on("receiveMessage", cb)

  const onMeetingEnded = (cb: () => void) =>
    socketRef.current?.on("meeting-ended", cb)

  const onHostTransferred = (cb: (d: any) => void) =>
    socketRef.current?.on("host-transferred", cb)

  const onRemovedFromMeeting = (cb: () => void) =>
    socketRef.current?.on("removed-from-meeting", cb)

  const onRoomUpdate = (cb: (d: any) => void) =>
    socketRef.current?.on("room-update", cb)

  const onWaitingRoomUpdate = (
    cb: (d: any) => void
  ) =>
    socketRef.current?.on(
      "waiting-room:update",
      cb
    )

  const onWaitingRoomApproved = (
    cb: () => void
  ) =>
    socketRef.current?.on(
      "waiting-room:approved",
      cb
    )

  const onWaitingRoomRejected = (
    cb: () => void
  ) =>
    socketRef.current?.on(
      "waiting-room:rejected",
      cb
    )

  // ================= NEW EXPOSED LISTENERS =================
  const onForceMute = (cb: () => void) =>
    socketRef.current?.on("force-mute", cb)

  const onActiveSpeaker = (cb: (d: any) => void) =>
    socketRef.current?.on("active-speaker", cb)

  const onHandUpdate = (cb: (d: any) => void) =>
    socketRef.current?.on("hand-update", cb)

  const onUserLeft = (cb: (d: any) => void) =>
    socketRef.current?.on("user-left", cb)

  const onUserReconnecting = (
    cb: (d: any) => void
  ) =>
    socketRef.current?.on(
      "user-reconnecting",
      cb
    )

  const onSystemMessage = (
    cb: (d: any) => void
  ) =>
    socketRef.current?.on(
      "system-message",
      cb
    )

  return {
    socket: socket,
    socketRef,

    sendMessage,
    raiseHand,
    leaveMeeting,
    requestJoinWaitingRoom,
    sendAudioLevel,
    updateMediaState,

    muteUser,
    removeUser,
    transferHost,
    endMeeting,

    onChatHistory,
    onReceiveMessage,
    onMeetingEnded,
    onHostTransferred,
    onRemovedFromMeeting,
    onRoomUpdate,

    onWaitingRoomUpdate,
    onWaitingRoomApproved,
    onWaitingRoomRejected,

    // NEW
    onForceMute,
    onActiveSpeaker,
    onHandUpdate,
    onUserLeft,
    startTyping,
    stopTyping,

    onUserReconnecting,
    onSystemMessage,
  }
}