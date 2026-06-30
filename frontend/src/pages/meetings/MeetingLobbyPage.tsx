import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Loader2, Video, VideoOff, Mic, MicOff } from "lucide-react"

import Layout from "../../components/common/Layout"
import { useSocket } from "../../hooks/useSocket"
import useAuthStore from "../../store/authStore"
import useMediaStore from "../../store/mediaStore"

export default function MeetingLobbyPage() {

  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const {
  micOn: storedMicOn,
  cameraOn: storedCameraOn,
  setMicOn: setStoredMicOn,
  setCameraOn: setStoredCameraOn,
} = useMediaStore()

  const { socketRef, requestJoinWaitingRoom } = useSocket(id ?? "", false)

const socket = socketRef.current

  // ================= STATE =================
  const [loading, setLoading] = useState(false)
  const [joined, setJoined] = useState(false)
  const [rejected, setRejected] = useState(false)
  const [approved, setApproved] = useState(false)

  const [micOn, setMicOn] = useState(storedMicOn)
  const [cameraOn, setCameraOn] = useState(storedCameraOn)
  const [cameraError, setCameraError] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

if (!id) {
  return (
    <div className="text-white">
      Invalid meeting link
    </div>
  )
}

  // ================= GET CAMERA =================
  useEffect(() => {
    async function initMedia() {
      try {
       const stream = await navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
})

streamRef.current = stream

stream.getAudioTracks().forEach((track) => {
  track.enabled = storedMicOn
})

stream.getVideoTracks().forEach((track) => {
  track.enabled = storedCameraOn
})

sessionStorage.setItem("meetingMic", String(storedMicOn))
sessionStorage.setItem("meetingCamera", String(storedCameraOn))

if (videoRef.current) {
  videoRef.current.srcObject = stream
}
      } catch (err) {
  console.error("Camera permission denied", err)
  setCameraError(true)
}
    }

    initMedia()

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  // ================= SOCKET EVENTS =================
  useEffect(() => {
  if (!socket || !id) return

  const approvedEvent = `approved:${user?._id}`
  const rejectedEvent = `rejected:${user?._id}`

  socket.on(approvedEvent, () => {
    setLoading(false)
    setApproved(true)

    setTimeout(() => {
      navigate(`/meetings/${id}`)
    }, 1200)
  })

  socket.on(rejectedEvent, () => {
    setLoading(false)
    setRejected(true)

    setTimeout(() => {
      navigate("/dashboard")
    }, 1800)
  })

  return () => {
    socket.off(approvedEvent)
    socket.off(rejectedEvent)
  }
}, [socket, id, user?._id, navigate])


  // ================= JOIN REQUEST =================
  const handleJoinRequest = () => {
  if (!socket || !id || !user?._id) return

  if (loading || joined) return

  setLoading(true)
  requestJoinWaitingRoom()

  setJoined(true)
}

  // ================= MEDIA TOGGLE =================
  const toggleMic = () => {
    if (!streamRef.current) return

    streamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled
    })

     setMicOn((prev) => {
  const next = !prev

  setStoredMicOn(next)

  sessionStorage.setItem("meetingMic", String(next))

  return next
})
  }

  const toggleCamera = () => {
    if (!streamRef.current) return

    streamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled
    })

    setCameraOn((prev) => {
  const next = !prev

  setStoredCameraOn(next)

  sessionStorage.setItem("meetingCamera", String(next))

  return next
})
  }


useEffect(() => {
  return () => {
    // stop camera + mic
    streamRef.current?.getTracks().forEach((track) => track.stop())

    // leave waiting room
    if (socket && id && user?._id) {
      socket.emit("leave-waiting-room", {
        meetingId: id,
        userId: user._id,
      })

      socket.disconnect() // 🔥 IMPORTANT FIX
    }
  }
}, [socket, id, user?._id])

useEffect(() => {
  if (!socket) return

  const timeout = setTimeout(() => {
    if (!approved && !rejected && joined) {
      setLoading(false)
    }
  }, 8000)

  return () => clearTimeout(timeout)
}, [socket, joined, approved, rejected])


 if (!socketRef.current) {
  return (
    <div className="text-white flex items-center justify-center h-screen">
      Connecting...
    </div>
  )
}

  return (
  <Layout>
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">

      {/* ================= TITLE ================= */}
      <h1 className="text-2xl font-bold mb-6">
        Meeting Lobby
      </h1>

      {/* ================= VIDEO PREVIEW ================= */}
      <div className="relative w-[360px] h-[240px] bg-gray-900 rounded-xl overflow-hidden border border-gray-700">

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        {cameraError && (
  <div className="absolute inset-0 flex items-center justify-center bg-black text-red-400 text-sm">
    Camera or microphone access denied
  </div>
)}


        {/* Overlay if camera OFF */}
        {!cameraOn && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <VideoOff size={40} />
          </div>
        )}

        {/* User name tag */}
        <div className="absolute bottom-2 left-2 text-sm bg-black/60 px-2 py-1 rounded">
          {user?.name || "You"}
        </div>
      </div>

      {/* ================= CONTROLS ================= */}
      <div className="flex items-center gap-4 mt-5">

        {/* MIC TOGGLE */}
        <button
          onClick={toggleMic}
          className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition"
        >
          {micOn ? <Mic /> : <MicOff />}
        </button>

        {/* CAMERA TOGGLE */}
        <button
          onClick={toggleCamera}
          className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition"
        >
          {cameraOn ? <Video /> : <VideoOff />}
        </button>
      </div>

      {/* ================= JOIN BUTTON ================= */}
      {!joined && !approved && (
        <button
          onClick={handleJoinRequest}
          disabled={loading}
          className="mt-8 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold flex items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          Request to Join
        </button>
      )}

      {/* ================= WAITING STATE ================= */}
      {joined && !approved && !rejected && (
        <div className="mt-6 text-center">
          <p className="text-yellow-400 font-medium">
            Waiting for host approval...
          </p>
        </div>
      )}

      {/* ================= APPROVED ================= */}
      {approved && (
        <div className="mt-6 text-center text-green-400">
          <p>Approved! Entering meeting...</p>
        </div>
      )}

      {/* ================= REJECTED ================= */}
      {rejected && (
        <div className="mt-6 text-center text-red-400">
          <p>Request rejected. Redirecting...</p>
        </div>
      )}

    </div>
  </Layout>
)
}