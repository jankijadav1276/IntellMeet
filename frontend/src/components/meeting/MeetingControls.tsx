import { useRef, useState } from "react"
import { Mic, MicOff, Video, VideoOff, Phone,SquareX, ScreenShare, ScreenShareOff, Circle, StopCircle } from "lucide-react"
import recordingService from "../../services/recordingService"

interface Props {
  micOn: boolean
  cameraOn: boolean
  isScreenSharing: boolean
  isHost: boolean

  meetingId: string

  onToggleMic: () => void
  onToggleCamera: () => void
  onLeave: () => void
  onToggleScreenShare: () => void
  onEndMeeting: () => void

  socket?: any
}

export default function MeetingControls({
  micOn,
  cameraOn,
  isScreenSharing,
  isHost,

  meetingId,

  onToggleMic,
  onToggleCamera,
  onLeave,
  onToggleScreenShare,
  onEndMeeting,
  socket,
}: Props) {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef =
  useRef<MediaRecorder | null>(null)

const chunksRef =
  useRef<Blob[]>([])

const recordingIdRef =
  useRef<string | null>(null)

  /* ================= RECORDING ================= */
 const handleRecordingToggle = async () => {
  if (!socket) return

  /* ================= START ================= */
  if (!isRecording) {
    try {
      const recording =
        await recordingService.startRecording(
          meetingId
        )

      recordingIdRef.current =
        recording._id

      const stream =
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        })

      const mediaRecorder =
        new MediaRecorder(stream)

      mediaRecorderRef.current =
        mediaRecorder

      chunksRef.current = []

      mediaRecorder.ondataavailable = (
        event
      ) => {
        if (event.data.size > 0) {
          chunksRef.current.push(
            event.data
          )
        }
      }

      mediaRecorder.start()

      socket.emit(
        "recording-started",
        {
          userId: socket.id,
        }
      )

      setIsRecording(true)

      console.log(
        "🔴 Recording started"
      )
    } catch (error) {
      console.error(
        "Recording start failed:",
        error
      )
    }

    return
  }

  /* ================= STOP ================= */
  try {
    const mediaRecorder =
      mediaRecorderRef.current

    if (!mediaRecorder) return

    mediaRecorder.onstop =
      async () => {
        try {
          const blob = new Blob(
            chunksRef.current,
            {
              type: "video/webm",
            }
          )

          if (
            !recordingIdRef.current
          ) {
            console.error(
              "Recording ID missing"
            )
            return
          }

          // Upload video file
          await recordingService.uploadRecording(
            recordingIdRef.current,
            blob
          )

          // Complete DB record
          await recordingService.stopRecording(
            recordingIdRef.current
          )

          console.log(
            "✅ Recording uploaded"
          )

          recordingIdRef.current =
            null

          chunksRef.current = []
        } catch (err) {
          console.error(
            "Upload failed:",
            err
          )
        }
      }

    mediaRecorder.stop()

    socket.emit(
      "recording-stopped"
    )

    setIsRecording(false)

    console.log(
      "⏹ Recording stopped"
    )
  } catch (error) {
    console.error(error)
  }
}
  return (
    <div className="flex items-center justify-center gap-3 bg-gray-900 border border-gray-800 rounded-xl p-3">

    {/* MIC */}
<button
  onClick={onToggleMic}
  title={micOn ? "Turn off microphone" : "Turn on microphone"}
  className={`p-3 rounded-lg transition ${
    micOn ? "bg-gray-800" : "bg-red-600"
  }`}
>
  {micOn ? <Mic /> : <MicOff />}
</button>

{/* CAMERA */}
<button
  onClick={onToggleCamera}
  title={cameraOn ? "Turn off camera" : "Turn on camera"}
  className={`p-3 rounded-lg transition ${
    cameraOn ? "bg-gray-800" : "bg-red-600"
  }`}
>
  {cameraOn ? <Video /> : <VideoOff />}
</button>

{/* SCREEN SHARE */}
<button
  onClick={onToggleScreenShare}
  title={isScreenSharing ? "Stop screen sharing" : "Start screen sharing"}
  className={`p-3 rounded-lg transition ${
    isScreenSharing ? "bg-blue-600" : "bg-gray-800"
  }`}
>
  {isScreenSharing ? <ScreenShareOff /> : <ScreenShare />}
</button>

{/* RECORDING (HOST ONLY) */}
{isHost && (
  <button
    onClick={handleRecordingToggle}
    title={isRecording ? "Stop recording" : "Start recording"}
    className={`p-3 rounded-lg transition ${
      isRecording
        ? "bg-red-600 animate-pulse"
        : "bg-gray-800"
    }`}
  >
    {isRecording ? <StopCircle /> : <Circle />}
  </button>
)}

{/* LEAVE MEETING (ALL USERS) */}
<button
  onClick={onLeave}
  title="Leave meeting"
  className="p-3 rounded-lg bg-red-600 hover:bg-red-500 transition"
>
  <Phone />
</button>

{/* END MEETING (HOST ONLY) */}
{isHost && (
  <button
    onClick={onEndMeeting}
    title="End meeting for everyone"
    className="p-3 rounded-lg bg-red-800 hover:bg-red-700 transition"
  >
    <SquareX />
  </button>
)}
    </div>
  )
}