import { useNavigate, useParams } from "react-router-dom"
import { Hand, Loader2, WifiOff } from "lucide-react"
import { useState } from "react"

import Layout from "../../components/common/Layout"
import VideoTile from "../../components/meeting/VideoTile"
import MeetingControls from "../../components/meeting/MeetingControls"
import ChatPanel from "../../components/meeting/ChatPanel"
import ParticipantList from "../../components/meeting/ParticipantList"
import MeetingHeader from "../../components/meeting/MeetingHeader"
import MeetingTimer from "../../components/meeting/MeetingTimer"
import { useWebRTC } from "../../hooks/useWebRTC"
import useAuthStore from "../../store/authStore"

export default function MeetingRoomPage() {
const { id } = useParams<{ id: string }>()
const navigate = useNavigate()
const { user } = useAuthStore()
const [handRaised, setHandRaised] = useState(false)

const meeting = {
id,
title: "Demo Meeting Room",
hostId: user?._id ?? "",
}

const {
localStream,
remotePeers,
micOn,
cameraOn,
toggleMic,
toggleCamera,
leaveCall,
isConnecting,
error: webrtcError,
} = useWebRTC(id)

function handleLeave() {
leaveCall()
navigate("/meetings")
}

const participants = [
{
id: user?._id ?? "me",
name: user?.name ?? "You",
isHost: true,
},
...remotePeers.map((p) => ({
id: p.peerId,
name: p.name,
isHost: false,
})),
]

return (
<Layout title={meeting.title} subtitle={`Meeting ID: ${id}`}>

{/* Error */}
{webrtcError && (
<div className="flex items-center gap-2 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-sm">
<WifiOff className="w-4 h-4" />
{webrtcError}
</div>
)}

{/* Header */}
<MeetingHeader
meetingTitle={meeting.title}
meetingCode={id ?? "demo"}
participantCount={participants.length}
/>

{/* Main Grid */}
<div className="grid grid-cols-1 xl:grid-cols-4 gap-4">

{/* Video Area */}
<div className="xl:col-span-3">
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

<VideoTile
name={user?.name ?? "You"}
isHost={true}
stream={localStream}
isLocal={true}
micOn={micOn}
cameraOn={cameraOn}
/>

{isConnecting && !localStream && (
<div className="bg-gray-900 border border-gray-800 rounded-xl h-64 flex items-center justify-center text-gray-400 gap-2">
<Loader2 className="w-4 h-4 animate-spin" />
Connecting...
</div>
)}

{remotePeers.map((peer) => (
<VideoTile
key={peer.peerId}
name={peer.name}
stream={peer.stream}
isLocal={false}
/>
))}

{remotePeers.length === 0 && !isConnecting && (
<div className="bg-gray-900 border border-gray-800 rounded-xl h-64 flex items-center justify-center text-gray-500">
Waiting for participants...
</div>
)}

</div>
</div>

{/* Side Panel */}
<div className="xl:col-span-1 space-y-4">
<MeetingTimer />
<ParticipantList participants={participants} />
<ChatPanel />
</div>

</div>

{/* Raise Hand */}
<div className="flex justify-center mt-4">
<button
onClick={() => setHandRaised(!handRaised)}
className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
handRaised
? "bg-yellow-500 text-black"
: "bg-gray-800 text-white hover:bg-gray-700"
}`}
>
<Hand className="w-4 h-4" />
{handRaised ? "Hand Raised" : "Raise Hand"}
</button>
</div>

{/* Controls */}
<MeetingControls
micOn={micOn}
cameraOn={cameraOn}
onToggleMic={toggleMic}
onToggleCamera={toggleCamera}
onLeave={handleLeave}
/>

</Layout>
)
}