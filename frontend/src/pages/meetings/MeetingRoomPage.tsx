import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Hand } from "lucide-react"

import Layout from "../../components/common/Layout"
import VideoTile from "../../components/meeting/VideoTile"
import MeetingControls from "../../components/meeting/MeetingControls"
import ChatPanel from "../../components/meeting/ChatPanel"
import ParticipantList from "../../components/meeting/ParticipantList"
import MeetingHeader from "../../components/meeting/MeetingHeader"
import MeetingTimer from "../../components/meeting/MeetingTimer"

export default function MeetingRoomPage() {
  const navigate = useNavigate()

  const [micOn, setMicOn] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [handRaised, setHandRaised] = useState(false)

  const participants = [
    {
      id: 1,
      name: "John",
      isHost: true
    },
    {
      id: 2,
      name: "Sarah"
    },
    {
      id: 3,
      name: "Alex"
    },
    {
      id: 4,
      name: "Emma"
    }
  ]

  return (
    <Layout
      title="Meeting Room"
      subtitle="Live Collaboration"
    >
      <div className="space-y-6">

        {/* Meeting Header */}
        <MeetingHeader
          meetingTitle="Product Standup"
          meetingCode="INT-2026"
          participantCount={participants.length}
        />

        {/* Main Meeting Area */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">

          {/* Video Section */}
          <div className="xl:col-span-3">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {participants.map((participant) => (
                <VideoTile
                  key={participant.id}
                  name={participant.name}
                  isHost={participant.isHost}
                />
              ))}

            </div>

          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1">

            <div className="space-y-4">

              <MeetingTimer />

              <ParticipantList
                participants={participants}
              />

              <ChatPanel />

            </div>

          </div>

        </div>

        {/* Raise Hand */}
        <div className="flex justify-center">

          <button
            onClick={() =>
              setHandRaised(!handRaised)
            }
            className={`
              px-4
              py-2
              rounded-lg
              flex
              items-center
              gap-2
              transition
              ${
                handRaised
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 text-white"
              }
            `}
          >
            <Hand className="w-4 h-4" />

            {handRaised
              ? "Hand Raised"
              : "Raise Hand"}
          </button>

        </div>

        {/* Meeting Controls */}
        <MeetingControls
          micOn={micOn}
          cameraOn={cameraOn}
          onToggleMic={() =>
            setMicOn(!micOn)
          }
          onToggleCamera={() =>
            setCameraOn(!cameraOn)
          }
          onLeave={() =>
            navigate("/dashboard")
          }
        />

      </div>
    </Layout>
  )
}