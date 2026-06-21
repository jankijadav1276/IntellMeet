import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  PhoneOff,
  XCircle,
} from "lucide-react"

interface MeetingControlsProps {
  micOn: boolean
  cameraOn: boolean
  onToggleMic: () => void
  onToggleCamera: () => void
  onLeave: () => void

  /* New */
  isHost?: boolean
  isScreenSharing?: boolean
  onToggleScreenShare?: () => void
  onEndMeeting: () => void
}

export default function MeetingControls({
  micOn,
  cameraOn,
  onToggleMic,
  onToggleCamera,
  onLeave,

  isHost = false,
  isScreenSharing = false,
  onToggleScreenShare,
  onEndMeeting,
}: MeetingControlsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">

      {/* Mic */}
      <button
        onClick={onToggleMic}
        className={`p-4 rounded-full transition ${
          micOn
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-red-600 hover:bg-red-500"
        }`}
        title={micOn ? "Mute microphone" : "Unmute microphone"}
      >
        {micOn ? (
          <Mic className="w-5 h-5 text-white" />
        ) : (
          <MicOff className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Camera */}
      <button
        onClick={onToggleCamera}
        className={`p-4 rounded-full transition ${
          cameraOn
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-red-600 hover:bg-red-500"
        }`}
        title={cameraOn ? "Turn camera off" : "Turn camera on"}
      >
        {cameraOn ? (
          <Video className="w-5 h-5 text-white" />
        ) : (
          <VideoOff className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Screen Share */}
      <button
        onClick={onToggleScreenShare}
        className={`p-4 rounded-full transition ${
          isScreenSharing
            ? "bg-blue-600 hover:bg-blue-500"
            : "bg-gray-800 hover:bg-gray-700"
        }`}
        title={
          isScreenSharing
            ? "Stop screen sharing"
            : "Start screen sharing"
        }
      >
        <MonitorUp className="w-5 h-5 text-white" />
      </button>

      {/* Leave Meeting */}
      <button
        onClick={onLeave}
        className="bg-red-600 hover:bg-red-500 p-4 rounded-full transition"
        title="Leave meeting"
      >
        <PhoneOff className="w-5 h-5 text-white" />
      </button>

      {/* Host Only */}
      {isHost && (
  <button
    onClick={() => {
      const confirmEnd = window.confirm(
        "End meeting for all participants?"
      )

      if (confirmEnd) {
        onEndMeeting()
      }
    }}
    className="bg-red-800 hover:bg-red-700 p-4 rounded-full transition"
    title="End meeting for everyone"
  >
    <XCircle className="w-5 h-5 text-white" />
  </button>
)}
    </div>
  )
}