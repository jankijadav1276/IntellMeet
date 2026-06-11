interface Participant {
  id: number
  name: string
  isHost?: boolean
}

interface ParticipantListProps {
  participants: Participant[]
}

export default function ParticipantList({
  participants
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

        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">

              {/* Online Indicator */}
              <div className="w-2 h-2 bg-green-500 rounded-full" />

              {/* Avatar */}
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {participant.name.charAt(0)}
              </div>

              <div>
                <p className="text-white text-sm">
                  {participant.name}
                </p>

                {participant.isHost && (
                  <p className="text-blue-400 text-xs">
                    Host
                  </p>
                )}
              </div>

            </div>
          </div>
        ))}

      </div>

    </div>
  )
}