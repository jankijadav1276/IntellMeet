import { Clock, Users } from "lucide-react"

interface MeetingHeaderProps {
  meetingTitle: string
  meetingCode: string
  participantCount: number
}

export default function MeetingHeader({
  meetingTitle,
  meetingCode,
  participantCount
}: MeetingHeaderProps) {

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">

      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-white text-xl font-semibold">
            {meetingTitle}
          </h2>

          <p className="text-gray-400 text-sm">
            Meeting Code: {meetingCode}
          </p>
        </div>

        <div className="flex gap-6">

          <div className="flex items-center gap-2 text-gray-300">
            <Users className="w-4 h-4" />
            {participantCount}
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-4 h-4" />
            Live
          </div>

        </div>

      </div>

    </div>
  )
}