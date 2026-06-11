import { useState, useRef, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff,
  PhoneOff, MessageSquare, Users, MoreVertical
} from "lucide-react"

// Mock participants
const mockParticipants = [
  { id: "1", name: "You", initials: "J", isMuted: false, isHost: true },
  { id: "2", name: "Alice Smith", initials: "AS", isMuted: true, isHost: false },
  { id: "3", name: "Bob Johnson", initials: "BJ", isMuted: false, isHost: false },
]

const mockMessages = [
  { id: "1", sender: "Alice Smith", text: "Can everyone hear me?", time: "10:01 AM" },
  { id: "2", sender: "Bob Johnson", text: "Yes! Loud and clear 👍", time: "10:02 AM" },
]

export default function MeetingRoomPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)

  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [showChat, setShowChat] = useState(true)
  const [showParticipants, setShowParticipants] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(mockMessages)
  const [isRecording, setIsRecording] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Start camera on mount
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.log("Camera not available:", err)
      }
    }
    startCamera()

    // Cleanup: stop camera when leaving
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setMessages([
      ...messages,
      { id: Date.now().toString(), sender: "You", text: message, time: "now" },
    ])
    setMessage("")
  }

  function handleEndCall() {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    navigate("/dashboard")
  }

  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden">

      {/* Top bar */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-white text-sm font-medium">Product Standup</span>
          <span className="text-gray-400 text-xs">Meeting ID: {id}</span>
        </div>
        <div className="flex items-center gap-3">
          {isRecording && (
            <span className="flex items-center gap-1.5 text-red-400 text-xs bg-red-500/10 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span>
              Recording
            </span>
          )}
          <span className="text-gray-400 text-xs">
            {mockParticipants.length} participants
          </span>
        </div>
      </header>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">

        {/* Video grid */}
        <div className="flex-1 p-4 grid grid-cols-2 gap-3 content-start">

          {/* Your video (large) */}
          <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video col-span-1">
            {isVideoOff ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  J
                </div>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover scale-x-[-1]"
              />
            )}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                You (Host)
              </span>
              {isMuted && (
                <span className="bg-red-500/80 p-1 rounded-md">
                  <MicOff className="w-3 h-3 text-white" />
                </span>
              )}
            </div>
          </div>

          {/* Other participants */}
          {mockParticipants.slice(1).map((p) => (
            <div key={p.id} className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                  {p.initials}
                </div>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                  {p.name}
                </span>
                {p.isMuted && (
                  <span className="bg-red-500/80 p-1 rounded-md">
                    <MicOff className="w-3 h-3 text-white" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right panel — chat or participants */}
        {(showChat || showParticipants) && (
          <aside className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col flex-shrink-0">

            {/* Panel tabs */}
            <div className="flex border-b border-gray-800">
              <button
                onClick={() => { setShowChat(true); setShowParticipants(false) }}
                className={`flex-1 py-3 text-sm font-medium transition ${
                  showChat ? "text-white border-b-2 border-blue-500" : "text-gray-400 hover:text-white"
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => { setShowParticipants(true); setShowChat(false) }}
                className={`flex-1 py-3 text-sm font-medium transition ${
                  showParticipants ? "text-white border-b-2 border-blue-500" : "text-gray-400 hover:text-white"
                }`}
              >
                People
              </button>
            </div>

            {/* Chat panel */}
            {showChat && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className={`text-xs font-medium ${
                          msg.sender === "You" ? "text-blue-400" : "text-gray-300"
                        }`}>
                          {msg.sender}
                        </span>
                        <span className="text-gray-500 text-xs">{msg.time}</span>
                      </div>
                      <p className="text-gray-200 text-sm bg-gray-800 rounded-lg px-3 py-2 inline-block max-w-full">
                        {msg.text}
                      </p>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={sendMessage} className="p-3 border-t border-gray-800 flex gap-2">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Send a message..."
                    className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-sm transition"
                  >
                    Send
                  </button>
                </form>
              </>
            )}

            {/* Participants panel */}
            {showParticipants && (
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {mockParticipants.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {p.initials}
                      </div>
                      <div>
                        <p className="text-white text-sm">{p.name}</p>
                        {p.isHost && (
                          <p className="text-blue-400 text-xs">Host</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.isMuted
                        ? <MicOff className="w-3.5 h-3.5 text-red-400" />
                        : <Mic className="w-3.5 h-3.5 text-green-400" />
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Controls bar */}
      <footer className="bg-gray-900 border-t border-gray-800 px-6 py-4 flex items-center justify-center gap-3 flex-shrink-0">

        {/* Mute */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`flex flex-col items-center gap-1 p-3 rounded-xl transition ${
            isMuted ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          <span className="text-xs">{isMuted ? "Unmute" : "Mute"}</span>
        </button>

        {/* Camera */}
        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`flex flex-col items-center gap-1 p-3 rounded-xl transition ${
            isVideoOff ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          <span className="text-xs">{isVideoOff ? "Start Video" : "Stop Video"}</span>
        </button>

        {/* Screen share */}
        <button
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={`flex flex-col items-center gap-1 p-3 rounded-xl transition ${
            isScreenSharing ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
          <span className="text-xs">Share</span>
        </button>

        {/* Record */}
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`flex flex-col items-center gap-1 p-3 rounded-xl transition ${
            isRecording ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          <div className={`w-5 h-5 flex items-center justify-center`}>
            <div className={`w-3 h-3 rounded-full ${isRecording ? "bg-red-400" : "bg-white"}`}></div>
          </div>
          <span className="text-xs">{isRecording ? "Stop Rec" : "Record"}</span>
        </button>

        {/* Chat toggle */}
        <button
          onClick={() => { setShowChat(!showChat); setShowParticipants(false) }}
          className={`flex flex-col items-center gap-1 p-3 rounded-xl transition ${
            showChat ? "bg-blue-500/20 text-blue-400" : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs">Chat</span>
        </button>

        {/* Participants toggle */}
        <button
          onClick={() => { setShowParticipants(!showParticipants); setShowChat(false) }}
          className={`flex flex-col items-center gap-1 p-3 rounded-xl transition ${
            showParticipants ? "bg-blue-500/20 text-blue-400" : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-xs">People</span>
        </button>

        {/* More */}
        <button className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition">
          <MoreVertical className="w-5 h-5" />
          <span className="text-xs">More</span>
        </button>

        {/* End call */}
        <button
          onClick={handleEndCall}
          className="flex flex-col items-center gap-1 p-3 rounded-xl bg-red-600 hover:bg-red-500 text-white transition ml-4"
        >
          <PhoneOff className="w-5 h-5" />
          <span className="text-xs">End</span>
        </button>

      </footer>
    </div>
  )
}