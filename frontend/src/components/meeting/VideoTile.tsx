import { useEffect, useRef } from "react"
import { MicOff, VideoOff } from "lucide-react"

interface VideoTileProps {
  name: string
  isHost?: boolean
  stream?: MediaStream | null
  isLocal?: boolean
  micOn?: boolean
  cameraOn?: boolean
  isActiveSpeaker?: boolean
}

export default function VideoTile({
  name,
  isHost = false,
  stream = null,
  isLocal = false,
  micOn = true,
  cameraOn = true,
  isActiveSpeaker = false,
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (video.srcObject !== stream) {
      video.srcObject = stream
    }

    if (stream) {
      video.onloadedmetadata = () => {
        video.play().catch(console.error)
      }
    } else {
      video.srcObject = null
    }
  }, [stream])

  useEffect(() => {
    if (stream) {
      console.log("[VIDEO STREAM]", name, stream.id, stream.active)
    }
  }, [stream, name])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    return () => {
      video.pause()
      video.srcObject = null
    }
  }, [])

  return (
    <div
      className={`bg-gray-900 rounded-xl w-full h-full relative overflow-hidden border transition ${
        isActiveSpeaker
          ? "border-green-500 shadow-lg shadow-green-500/20"
          : "border-gray-800"
      }`}
    >
      {/* Real video stream */}
      {stream && stream.active ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-contain bg-black ${isLocal ? "scale-x-[-1]" : ""}`}
          muted={isLocal}
        />
      ) : (
        // Avatar fallback
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl font-semibold">
              {name.charAt(0).toUpperCase()}
            </div>
            <p className="text-white font-medium">{name}</p>
            {isHost && <p className="text-blue-400 text-xs mt-1">Host</p>}
          </div>
        </div>
      )}

      {/* Name + host label overlay — bottom left */}
      {stream && (
        <div className="absolute bottom-2 left-3 z-10">
          <p className="text-white text-sm font-medium drop-shadow">{name}</p>
          {isHost && <p className="text-blue-400 text-xs">Host</p>}
        </div>
      )}

      {/* STATUS ICONS — Top Right Corner */}
      <div className="absolute top-2 right-2 flex gap-1.5 z-10 pointer-events-none">
        {!micOn && (
          <div className="bg-red-600/90 p-1 rounded-md shadow-md">
            <MicOff className="w-3 h-3 text-white" />
          </div>
        )}
        {!cameraOn && (
          <div className="bg-red-600/90 p-1 rounded-md shadow-md">
            <VideoOff className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* BADGES — Top Left Corner Container */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
        {isLocal && (
          <div className="bg-blue-600/80 text-white text-xs px-2 py-0.5 rounded-md font-medium shadow-md">
            You
          </div>
        )}
      </div>
    </div>
  )
}