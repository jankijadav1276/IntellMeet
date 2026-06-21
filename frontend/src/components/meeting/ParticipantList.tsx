import {
Mic,
MicOff,
Video,
VideoOff,
Hand,
Crown,
} from "lucide-react"

interface Participant {
id: string
userId: string
name: string
isHost?: boolean
raised?: boolean
micOn?: boolean
cameraOn?: boolean
}

interface ParticipantListProps {
participants: Participant[]

isCurrentUserHost?: boolean

currentUserId?: string

onMute?: (
participantId: string
) => void

onRemove?: (
participantId: string
) => void

onTransferHost?: (
userId: string
) => void
}

export default function ParticipantList({
participants,
isCurrentUserHost = false,
currentUserId,

onMute,
onRemove,
onTransferHost,
}: ParticipantListProps) {
return (
  
  <div className="bg-gray-900 border border-gray-800 rounded-xl">


  {/* Header */}
  <div className="p-4 border-b border-gray-800">
    <h2 className="text-white font-semibold">
      Participants ({participants.length})
    </h2>
  </div>

  {/* List */}
  <div className="p-4 space-y-3">

    {participants.length === 0 ? (
      <p className="text-gray-500 text-sm text-center">
        No participants found
      </p>
    ) : (
      participants.map((participant) => {
        const isMe =
          participant.userId ===
          currentUserId

        return (
          <div
            key={participant.id}
            className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2"
          >
            {/* LEFT */}
            <div className="flex items-center gap-3">

              <div className="w-2 h-2 bg-green-500 rounded-full" />

              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {participant.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">

                  <p className="text-white text-sm">
                    {participant.name}

                    {isMe && (
                      <span className="text-gray-400 ml-1">
                        (You)
                      </span>
                    )}
                  </p>

                  {participant.isHost && (
                    <span className="flex items-center gap-1 text-yellow-400 text-xs">
                      <Crown className="w-3 h-3" />
                      Host
                    </span>
                  )}

                  {participant.raised && (
                    <span
                      title="Hand Raised"
                      className="text-yellow-400"
                    >
                      <Hand className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1">

                  {participant.micOn ? (
                    <Mic className="w-4 h-4 text-green-400" />
                  ) : (
                    <MicOff className="w-4 h-4 text-red-400" />
                  )}

                  {participant.cameraOn ? (
                    <Video className="w-4 h-4 text-green-400" />
                  ) : (
                    <VideoOff className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
            </div>

            {/* HOST ACTIONS */}
            {isCurrentUserHost &&
              !participant.isHost &&
              !isMe && (
                <div className="flex items-center gap-2">

                  <button
                    onClick={() =>
                      onTransferHost?.(
                        participant.userId
                      )
                    }
                    className="px-2 py-1 text-xs rounded bg-yellow-600 hover:bg-yellow-500 text-white transition"
                  >
                    Host
                  </button>

                  <button
                    onClick={() =>
                      onMute?.(
                        participant.id
                      )
                    }
                    className="px-2 py-1 text-xs rounded bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition"
                  >
                    Mute
                  </button>

                  <button
                    onClick={() =>
                      onRemove?.(
                        participant.id
                      )
                    }
                    className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                  >
                    Remove
                  </button>

                </div>
              )}
          </div>
        )
      })
    )}
  </div>
</div>


)
}
