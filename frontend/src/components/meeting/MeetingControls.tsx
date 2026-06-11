import {
  Mic,
  Video,
  MonitorUp,
  PhoneOff
} from "lucide-react"

interface MeetingControlsProps {
  micOn: boolean
  cameraOn: boolean
  onToggleMic: () => void
  onToggleCamera: () => void
  onLeave: () => void
}

export default function MeetingControls({
  micOn,
  cameraOn,
  onToggleMic,
  onToggleCamera,
  onLeave
}: MeetingControlsProps) {

  return (
    <div className="flex justify-center gap-4">

      {/* Mic */}
      <button
        onClick={onToggleMic}
        className={`p-4 rounded-full transition ${
          micOn
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-red-600 hover:bg-red-500"
        }`}
      >
        <Mic className="w-5 h-5 text-white" />
      </button>

      {/* Camera */}
      <button
        onClick={onToggleCamera}
        className={`p-4 rounded-full transition ${
          cameraOn
            ? "bg-gray-800 hover:bg-gray-700"
            : "bg-red-600 hover:bg-red-500"
        }`}
      >
        <Video className="w-5 h-5 text-white" />
      </button>

      {/* Screen Share */}
      <button
        className="bg-gray-800 hover:bg-gray-700 p-4 rounded-full transition"
      >
        <MonitorUp className="w-5 h-5 text-white" />
      </button>

      {/* Leave Meeting */}
      <button
        onClick={onLeave}
        className="bg-red-600 hover:bg-red-500 p-4 rounded-full transition"
      >
        <PhoneOff className="w-5 h-5 text-white" />
      </button>

    </div>
  )
}