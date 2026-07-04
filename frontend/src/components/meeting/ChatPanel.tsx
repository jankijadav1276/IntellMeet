import { useEffect, useRef, useState } from "react"
import { Send } from "lucide-react"
import useAuthStore from "../../store/authStore"
import { useChatStore } from "../../store/chatStore"


interface ChatPanelProps {
  socket: any | null
  meetingId?: string
}

export default function ChatPanel({
  socket,
  meetingId,
}: ChatPanelProps) {
  const { user } = useAuthStore()

  const [message, setMessage] = useState("")
  const messages = useChatStore((s) => s.messages)
  const typingUsers = useChatStore((s) => s.typingUsers)
  

  const bottomRef = useRef<HTMLDivElement | null>(null)
  const typingTimeoutRef = useRef<any>(null)


  /* ================= AUTO SCROLL ================= */
useEffect(() => {
  const el = bottomRef.current
  if (!el) return

  const isNearBottom =
    el.getBoundingClientRect().top <
    window.innerHeight

  if (isNearBottom) {
    el.scrollIntoView({ behavior: "smooth" })
  }
}, [messages])

useEffect(() => {
  if (!socket) return

  const handleTyping = (data: {
    userId: string
    name: string
  }) => {
    useChatStore
      .getState()
      .addTypingUser({
        userId: data.userId,
        name: data.name,
      })
  }

  const handleStopTyping = (data: {
    userId: string
  }) => {
    useChatStore
      .getState()
      .removeTypingUser(
        data.userId
      )
  }

  socket.on(
    "user-typing",
    handleTyping
  )

  socket.on(
    "user-stop-typing",
    handleStopTyping
  )

  return () => {
    socket.off(
      "user-typing",
      handleTyping
    )

    socket.off(
      "user-stop-typing",
      handleStopTyping
    )
  }
}, [socket])

  /* ================= SEND MESSAGE ================= */
  const handleSendMessage = () => {
    if (!message.trim() || !socket) return

      socket?.emit("sendMessage", {
        meetingId,
        userId: user?._id,
        name: user?.name,
        message,
        timestamp: new Date().toISOString(),
      })

    socket?.emit("stop-typing", {
  meetingId,
  userId: user?._id,
  name: user?.name,
})

setMessage("")
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl flex flex-col h-[400px]">

      {/* HEADER */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-white font-semibold">
          Meeting Chat
        </h2>
      </div>

      {/* CHAT LIST */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm">
            No messages yet
          </div>
        )}

        {messages.map((msg, index) => {
          const isMine =
            msg.userId === user?._id
            


          return (
            <div
              key={index}
              className={`flex ${
                isMine
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-3 py-2 ${
                  isMine
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-100"
                }`}
              >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium">
                {isMine ? "You" : msg.name}
              </span>

              <span className="text-[10px] opacity-70">
                {new Date(
                  msg.timestamp
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <p className="text-sm break-words">
              {msg.message}
            </p>
              </div>
            </div>
          )
        })}
                  {/* TYPING INDICATOR - ADD HERE */}
        {typingUsers.length > 0 && (
          <div className="px-3 py-2 text-xs text-blue-400 italic animate-pulse">
            {typingUsers.length === 1
              ? `${typingUsers[0].name} is typing...`
              : `${typingUsers.length} people are typing...`}
          </div>
        )}
        <div ref={bottomRef} />
      </div>



      {/* INPUT */}
      
      <div className="border-t border-gray-800 p-4 flex gap-2">

        <input
          value={message}
         onChange={(e) => {
  setMessage(e.target.value)

  if (!socket) return

  // send typing event immediately
  socket.emit("typing", {
    meetingId,
    userId: user?._id,
    name: user?.name,
  })

  // clear previous timeout
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current)
  }

  // stop typing after 1s inactivity
  typingTimeoutRef.current = setTimeout(() => {
    socket.emit("stop-typing", {
      meetingId,
      userId: user?._id,
      name: user?.name,
    })
  }, 1000)
}}
          placeholder="Type a message..."
          className="
            flex-1
            bg-gray-800
            border
            border-gray-700
            rounded-lg
            px-4
            py-2
            text-white
            placeholder-gray-400
            focus:outline-none
            focus:border-blue-500
          "
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage()
            }
          }}
        />

        <button
          onClick={handleSendMessage}
          title="Send message"
          className="
            bg-blue-600
            hover:bg-blue-500
            px-4
            rounded-lg
            transition
          "
        >
          <Send className="w-4 h-4 text-white" />
        </button>

      </div>

    </div>
  )
}