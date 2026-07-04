import { Clock, Users, Copy, Check } from "lucide-react"
import { useState } from "react"

interface MeetingHeaderProps {
  meetingTitle: string
  meetingCode: string
  participantCount: number
  inviteLink: string
}

export default function MeetingHeader({
  meetingTitle,
  meetingCode,
  participantCount,
  inviteLink,
}: MeetingHeaderProps)  {

  const [copied, setCopied] = useState(false)

  

  const copyMeetingLink = async () => {
    await navigator.clipboard.writeText(inviteLink)

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-4">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h2 className="text-white text-xl font-semibold">
            {meetingTitle}
          </h2>

          <p className="text-gray-400 text-sm">
            Meeting Code: {meetingCode}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">

          <div className="flex items-center gap-2 text-gray-300">
            <Users className="w-4 h-4" />
            {participantCount}
          </div>

          <div className="flex items-center gap-2 text-green-400">
            <Clock className="w-4 h-4" />
            Live
          </div>

          <button
  onClick={copyMeetingLink}
  title="Copy Invite Link"
  className="p-2 rounded-full hover:bg-gray-800 transition"
>
  {copied ? (
    <Check className="w-5 h-5 text-green-500" />
  ) : (
    <Copy className="w-5 h-5 text-gray-300 hover:text-white" />
  )}
</button>

        </div>

      </div>

    </div>
  )
}