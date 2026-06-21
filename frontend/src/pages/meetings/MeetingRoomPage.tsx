import { useNavigate, useParams } from "react-router-dom"
import { Hand, Loader2, WifiOff } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useSocket } from "../../hooks/useSocket"

import Layout from "../../components/common/Layout"
import VideoTile from "../../components/meeting/VideoTile"
import MeetingControls from "../../components/meeting/MeetingControls"
import ChatPanel from "../../components/meeting/ChatPanel"
import ParticipantList from "../../components/meeting/ParticipantList"
import MeetingHeader from "../../components/meeting/MeetingHeader"
import MeetingTimer from "../../components/meeting/MeetingTimer"
import { useWebRTC } from "../../hooks/useWebRTC"
import useAuthStore from "../../store/authStore"
import { useChatStore } from "../../store/chatStore"


export default function MeetingRoomPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  useEffect(() => {
  if (!id) {
    navigate("/dashboard", { replace: true })
  }
  }, [id, navigate])
  
  const { user } = useAuthStore()

const {
  socket,
  transferHost,
  removeUser,
  endMeeting,
} = useSocket(id)

  const [handRaised, setHandRaised] = useState(false)
  const [participants, setParticipants] = useState<any[]>([])
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

const [toastMessage, setToastMessage] =
  useState<{
    name: string
    message: string
  } | null>(null)
  const [hostUserId, setHostUserId] =
  useState<string | null>(null)
  const [reconnectingUser, setReconnectingUser] =
  useState<string | null>(null)
  
const {
  localStream,
  remotePeers,

  micOn,
  cameraOn,

  isScreenSharing,
  toggleScreenShare,

  toggleMic,
  toggleCamera,

  leaveCall,
  isConnecting,
  error: webrtcError,
} = useWebRTC(id, socket)

  /* ================= SOCKET EVENTS ================= */
useEffect(() => {
if (!socket) return

socket.on("chat-history", (history: any[]) => {
  useChatStore.getState().setMessages(history || [])
})

socket.on("receiveMessage",(msg) => {
  useChatStore.getState().addMessage(msg)
})

  // ================= ROOM SYNC =================
const syncRoom = (data: any) => {
  console.log(
    "ROOM UPDATE RECEIVED",
    data
  )

  const list = Array.isArray(data?.participants)
    ? data.participants
    : []

  console.log(
    "Participants Count:",
    list.length
  )

  setParticipants(list)

  const host = list.find(
    (p: any) => p.isHost
  )

  if (host?.userId) {
    setHostUserId(host.userId)
  }

  setReconnectingUser(null)
}
  // ================= ACTIVE SPEAKER =================
  const handleActiveSpeaker = (data: any) => {
    setActiveSpeaker(data?.socketId || null)
  }

  // ================= MEETING ENDED =================
  const handleMeetingEnded = () => {
    leaveCall()
    alert("Meeting ended.")
    navigate("/dashboard", { replace: true })
  }

  // ================= HOST TRANSFER =================
 const handleHostTransfer = (data: any) => {
  const list = Array.isArray(
    data?.participants
  )
    ? data.participants
    : []

  setParticipants(list)

  const host = list.find(
    (p: any) => p.isHost
  )

  if (host?.userId) {
    setHostUserId(host.userId)
  }

  setReconnectingUser(null)

  if (data.newHostUserId === user?._id) {
    alert(
      "You are now the meeting host."
    )
  }
}

  const handleUserReconnecting = (data: any) => {
  setReconnectingUser(data.userId)
}

const handleSystemMessage = (data: any) => {
  alert(data.message)
}

  // ================= REMOVED =================
  const handleRemoved = () => {
    leaveCall()
    alert("You were removed from the meeting.")
    navigate("/dashboard", { replace: true })
  }

  // ================= EVENT BIND =================
  socket.on("room-update", syncRoom)
 socket.on("user-left", (data) => {
  console.log("User left:", data)
})
  socket.on("hand-update", syncRoom)

  socket.on("active-speaker", handleActiveSpeaker)
  socket.on("meeting-ended", handleMeetingEnded)
  socket.on("host-transferred", handleHostTransfer)
socket.on("removed-from-meeting", handleRemoved)

socket.on(
  "user-reconnecting",
  handleUserReconnecting
)

socket.on(
  "system-message",
  handleSystemMessage
)

  // ❌ REMOVE THIS (NOT USED IN BACKEND)
  // socket.on("user-joined", syncParticipants)

  return () => {
    socket.off("room-update", syncRoom)
    socket.off("user-left", syncRoom)
    socket.off("hand-update", syncRoom)

    socket.off("active-speaker", handleActiveSpeaker)
    socket.off("meeting-ended", handleMeetingEnded)
    socket.off("host-transferred", handleHostTransfer)
    socket.off("removed-from-meeting", handleRemoved)
    socket.off(
  "user-reconnecting",
  handleUserReconnecting
)

socket.off(
  "system-message",
  handleSystemMessage
)
socket.off("chat-history")
socket.off("receiveMessage")
  }
}, [
  socket,
  leaveCall,
  navigate,
  user?._id,
  showChat,
])

  /* ================= SINGLE LEAVE FUNCTION ================= */
  function handleLeave() {
    leaveCall()

    socket?.emit("leaveMeeting", {
      meetingId: id,
      userId: user?._id,
    })

    navigate("/dashboard", { replace: true })
  }

  /* ================= HOST CHECK ================= */
      const isHost = useMemo(() => {
  return Boolean(user?._id && hostUserId === user._id)
}, [hostUserId, user?._id])

  /* ================= PARTICIPANTS ================= */
 const sidebarParticipants = useMemo(() => {
  return participants.map((p) => ({
    id: p.socketId,
    userId: p.userId,
    name: p.name,
    isHost: p.isHost,
    raised: p.raisedHand,
    micOn: p.micOn,
    cameraOn: p.cameraOn,
  }))
}, [participants])

  /* ================= UNIQUE PEERS ================= */
const uniquePeers = useMemo(() => {
  const map = new Map()

  remotePeers.forEach((p) => {
    if (p?.peerId) {
      map.set(p.peerId, p)
    }
  })

  return Array.from(map.values())
}, [remotePeers])

  /* ================= HAND SYNC ================= */
useEffect(() => {
  const me = participants.find((p) => p.userId === user?._id)
  setHandRaised(Boolean(me?.raisedHand))
}, [participants, user?._id])

  return (
    <Layout title="Meeting Room" subtitle={`Room: ${id}`}>
      <div className="space-y-4">

        {/* STATUS */}
        <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-300">
          <div className="flex gap-4">
            <span className="text-green-400">● Connected</span>
            <span>👥 {participants.length}</span>
            <span>🎥 Live Meeting</span>
          </div>
          <div className="text-xs text-gray-500">ID: {id}</div>
        </div>

        {/* ERROR */}
        {webrtcError && (
          <div className="flex items-center gap-2 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-sm">
            <WifiOff className="w-4 h-4" />
            {webrtcError}
          </div>
        )}
        {reconnectingUser && (
  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2 text-yellow-400 text-sm">
    User is reconnecting...
  </div>
)}

        <MeetingHeader
          meetingTitle={`Meeting ${id}`}
          meetingCode={id ?? ""}
          participantCount={
              sidebarParticipants.length
            }
        />

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">

          {/* VIDEO */}
          <div className="xl:col-span-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

          <div className="relative">
            <VideoTile
              name={user?.name ?? "You"}
              stream={localStream}
              isLocal
              isHost={isHost}
              micOn={micOn}
              cameraOn={cameraOn}
              isActiveSpeaker={activeSpeaker === socket?.id}
            />

            {isScreenSharing && (
              <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-lg">
                Sharing Screen
              </div>
            )}
          </div>

              {isConnecting && !localStream && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl h-64 flex items-center justify-center gap-2 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting camera...
                </div>
              )}

              {uniquePeers.map((peer) => (
                <VideoTile
                  key={peer.peerId}
                  name={peer.name}
                  stream={peer.stream}
                  isActiveSpeaker={activeSpeaker === peer.peerId}
                />
              ))}

              {uniquePeers.length === 0 && !isConnecting && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl h-64 flex items-center justify-center text-gray-500">
                  Waiting for others to join...
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
       <div className="xl:col-span-1 space-y-4">
            <MeetingTimer />

      <ParticipantList
        participants={sidebarParticipants}
        isCurrentUserHost={isHost}
        currentUserId={user?._id}
        onMute={(socketId) => {
          socket?.emit("mute-user", {
            targetSocketId: socketId,
          })
        }}
        onRemove={(socketId) => {
          removeUser(socketId)
        }}
        onTransferHost={(userId) => {
          transferHost(userId)
        }}
      />

            {showChat && (
              <ChatPanel
                socket={socket}
                meetingId={id}
              />
            )}
          </div>
        </div>

        {/* HAND RAISE */}
        {/* HAND RAISE + CHAT */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => {
              const raised = !handRaised
              setHandRaised(raised)

              socket?.emit("raise-hand", {
                meetingId: id,
                userId: user?._id,
                name: user?.name,
                raised,
              })
            }}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              handRaised
                ? "bg-yellow-500 text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >

           
            <Hand className="w-4 h-4" />
            {handRaised ? "Hand Raised" : "Raise Hand"}
          </button>

           <button
                title="Chat"
                onClick={() => {
                      const next = !showChat

                      setShowChat(next)

                      if (next) {
                        setUnreadCount(0)
                      }
                    }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white"
              >
                
              {showChat ? "Hide Chat" : "Open Chat"}

              {!showChat &&
                unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}

            </button>
        </div>
{toastMessage && (
  <div className="fixed top-5 right-5 z-50 bg-gray-900 border border-gray-700 shadow-xl rounded-xl p-4 min-w-[280px] animate-pulse">
    <p className="text-blue-400 font-medium text-sm">
      {toastMessage.name}
    </p>

    <p className="text-gray-200 text-sm mt-1 truncate">
      {toastMessage.message}
    </p>
  </div>
)}
        {/* CONTROLS (ONLY ONE ACTION NOW) */}
      <MeetingControls
        micOn={micOn}
        cameraOn={cameraOn}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onLeave={handleLeave}
        isHost={isHost}

        isScreenSharing={isScreenSharing}
        onToggleScreenShare={toggleScreenShare}

        onEndMeeting={() => {
          endMeeting()
        }}
      />
      </div>
    </Layout>
  )
}
