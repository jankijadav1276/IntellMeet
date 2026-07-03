import { Clock, Users, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import Layout from "../../components/common/Layout"

import meetingService from "../../services/meetingService"

export default function MeetingHistoryPage() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ["meetings-history"],
    queryFn: () => meetingService.getMeetings(),
  })

 const meetings = data || []

 const getStatusStyle = (status: string) => {
  switch (status) {
    case "scheduled":
      return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"

    case "active":
      return "bg-green-500/10 text-green-400 border border-green-500/20"

    case "completed":
      return "bg-blue-500/10 text-blue-400 border border-blue-500/20"

    default:
      return "bg-gray-500/10 text-gray-400 border border-gray-500/20"
  }
}

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        Loading meetings...
      </div>
    )
  }


return (
  <Layout
    title="Meeting History"
    subtitle="Review completed meetings and AI-generated summaries"
  >
    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <p className="text-gray-400 text-sm">Total Meetings</p>
        <p className="text-3xl font-bold text-white">
          {meetings.length}
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <p className="text-gray-400 text-sm">Completed</p>
        <p className="text-3xl font-bold text-green-400">
          {
            meetings.filter(
              (meeting: any) =>
                meeting.status === "completed"
            ).length
          }
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <p className="text-gray-400 text-sm">AI Summaries</p>
        <p className="text-3xl font-bold text-blue-400">
          {
            meetings.filter(
              (meeting: any) =>
                meeting.summary ||
                meeting.aiSummary
            ).length
          }
        </p>
      </div>
    </div>

    {/* Search */}
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search meetings..."
        className="
          w-full
          bg-gray-900
          border
          border-gray-800
          rounded-xl
          px-4
          py-3
          text-white
          focus:outline-none
          focus:border-blue-500
        "
      />
    </div>

    {/* Empty State */}
    {meetings.length === 0 ? (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">

        <FileText
          size={50}
          className="mx-auto text-gray-500 mb-4"
        />

        <h2 className="text-xl font-semibold text-white">
          No Meetings Found
        </h2>

        <p className="text-gray-400 mt-2">
          Completed meetings will appear here.
        </p>

      </div>
    ) : (
      <div className="space-y-4">

        {meetings.map((meeting: any) => (
          <div
            key={meeting._id}
            className="
              bg-gray-900
              border
              border-gray-800
              rounded-xl
              p-5
              hover:border-blue-500/40
              transition-all
            "
          >
            <div className="flex flex-col lg:flex-row justify-between gap-6">

              {/* Left */}
              <div>

                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl font-semibold text-white">
                    {meeting.title}
                  </h2>

                 <span
                    className={`px-2 py-1 rounded text-xs border ${getStatusStyle(
                      meeting.status
                    )}`}
                  >
                    {meeting.status.charAt(0).toUpperCase() +
                      meeting.status.slice(1)}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mt-2">
                  {new Date(
                    meeting.createdAt
                  ).toLocaleString()}
                </p>

                {meeting.code && (
                  <p className="text-gray-500 text-sm mt-1">
                    Code: {meeting.code}
                  </p>
                )}

              </div>

              {/* Right */}
              <div className="flex flex-wrap items-center gap-6">

                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={18} />
                  <span>
                    {meeting.duration || 0} min
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-400">
                  <Users size={18} />
                  <span>
                    {meeting.participants?.length || 0}
                  </span>
                </div>

              
<div className="flex items-center gap-2">

  {/* Chat */}
  {meeting.status === "completed" &&
    meeting.chats?.length > 0 && (
      <button
        onClick={() =>
          navigate(`/meetings/${meeting._id}/chat`)
        }
        className="
          bg-gray-800
          hover:bg-gray-700
          text-white
          px-4
          py-2
          rounded-lg
          transition
        "
      >
        View Chat
      </button>
    )}

  {/* Transcript */}
  {meeting.status === "completed" &&
    meeting.transcript?.length > 0 && (
      <button
        onClick={() =>
          navigate(
            `/meetings/${meeting._id}/transcript`
          )
        }
        className="
          bg-purple-600
          hover:bg-purple-500
          text-white
          px-4
          py-2
          rounded-lg
          transition
        "
      >
        View Transcript
      </button>
    )}

  {/* Summary */}
  {meeting.status === "completed" &&
    meeting.summary && (
      <button
        onClick={() =>
          navigate(
            `/meetings/${meeting._id}/summary`
          )
        }
        className="
          bg-blue-600
          hover:bg-blue-500
          text-white
          px-4
          py-2
          rounded-lg
          transition
          flex
          items-center
          gap-2
        "
      >
        <FileText size={16} />
        View Summary
      </button>
    )}

  {/* Upcoming Meeting */}
  {meeting.status === "scheduled" && (
    <span className="text-yellow-400 text-sm font-medium">
      Meeting not started yet
    </span>
  )}

  {/* Active Meeting */}
  {meeting.status === "active" && (
    <span className="text-green-400 text-sm font-medium">
      Meeting in progress
    </span>
  )}

</div>

              </div>

            </div>
          </div>
        ))}

      </div>
    )}
  </Layout>
)
}