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

  // Whenever the stream changes, attach it to the <video> element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
          <div
        className={`bg-gray-900 rounded-xl h-64 relative overflow-hidden border transition ${
          isActiveSpeaker
            ? "border-green-500 shadow-lg shadow-green-500/20"
            : "border-gray-800"
        }`}
>
      {/* Real video stream — shown when camera is on and stream exists */}
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          // Mirror your own video so it feels natural (like a mirror)
          className={`w-full h-full object-cover ${isLocal ? "scale-x-[-1]" : ""}`}
          // Mute local video to avoid echo — remote videos play audio normally
          muted={isLocal}
        />
      ) : (
        // Avatar fallback — shown when camera is off or no stream yet
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

      {/* Name + host label overlay — always visible at bottom left */}
      {stream && (
        <div className="absolute bottom-2 left-3">
          <p className="text-white text-sm font-medium drop-shadow">{name}</p>
          {isHost && <p className="text-blue-400 text-xs">Host</p>}
        </div>
      )}

      {/* Status icons — top right corner */}
      <div className="absolute top-2 right-2 flex gap-1.5">
        {!micOn && (
          <div className="bg-red-600/90 p-1 rounded-md">
            <MicOff className="w-3 h-3 text-white" />
          </div>
        )}
        {!cameraOn && (
          <div className="bg-red-600/90 p-1 rounded-md">
            <VideoOff className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* YOU label on your own tile */}
      {isLocal && (
        <div className="absolute top-2 left-2 bg-blue-600/80 text-white text-xs px-2 py-0.5 rounded-md">
          You
        </div>
      )}

    </div>
  )
}