import { useState } from "react"
import { Send } from "lucide-react"

interface Message {
  id: number
  user: string
  text: string
}

export default function ChatPanel() {
  const [message, setMessage] = useState("")

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: "John",
      text: "Good morning team!"
    },
    {
      id: 2,
      user: "Sarah",
      text: "Let's start today's meeting."
    },
    {
      id: 3,
      user: "Alex",
      text: "Frontend module is completed."
    }
  ])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage: Message = {
      id: Date.now(),
      user: "You",
      text: message
    }

    setMessages([...messages, newMessage])
    setMessage("")
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl h-full flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-white font-semibold">
          Meeting Chat
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 h-[300px] overflow-y-auto p-4 space-y-4">

        {messages.map((msg) => (
          <div key={msg.id}>

            <p className="text-blue-400 text-sm font-medium">
              {msg.user}
            </p>

            <p className="text-gray-200 text-sm mt-1">
              {msg.text}
            </p>

          </div>
        ))}

      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-4 flex gap-2">

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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