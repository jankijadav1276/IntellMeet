import { useState } from "react"
import {
  Plus,
  Search,
  Video,
  Users,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import Layout from "../../components/common/Layout"
import meetingService from "../../services/meetingService"

export default function MeetingsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [search, setSearch] = useState("")

  /*
   * Fetch meetings
   */
  const {
    data: meetings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myMeetings"],
    queryFn: meetingService.getMyMeetings,
  })

  /*
   * Delete meeting
   */
  const deleteMutation = useMutation({
    mutationFn: meetingService.deleteMeeting,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myMeetings"],
      })
    },
  })

  /*
   * Filter meetings
   */
  const filteredMeetings = meetings.filter((meeting: any) =>
    meeting.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
  <Layout title="Meetings">
    
      <div className="space-y-6">

        {/* Search + New Meeting */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">

          <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 w-full md:max-w-md">
            <Search className="w-4 h-4 text-gray-500" />

            <input
              type="text"
              placeholder="Search meetings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-white flex-1"
            />
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            New Meeting
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
            <AlertCircle className="w-4 h-4" />
            Failed to load meetings.
          </div>
        )}

        {/* Empty */}
        {!isLoading &&
          !isError &&
          filteredMeetings.length === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-10 text-center">
              <Video className="w-10 h-10 mx-auto text-gray-600 mb-4" />

              <h3 className="text-white font-medium">
                No meetings found
              </h3>

              <p className="text-gray-400 text-sm mt-2">
                Create your first meeting from Dashboard.
              </p>
            </div>
          )}

        {/* Meetings */}
        <div className="grid gap-4">
          {filteredMeetings.map((meeting: any) => (
            <div
              key={meeting._id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* Left */}
              <div className="flex items-center gap-4">

                <div className="bg-gray-800 p-3 rounded-lg">
                  <Video className="w-5 h-5 text-blue-400" />
                </div>

              <div>
                <h3 className="text-white text-lg font-semibold">
                  {meeting.title}
                </h3>

                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(
                      meeting.startTime
                    ).toLocaleString()}
                  </p>

                  <p className="text-gray-500 text-xs mt-1">
                    Code: {meeting.meetingCode}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-wrap items-center gap-4">

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Users className="w-4 h-4" />

                  {meeting.participants?.length || 0}
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    meeting.status === "active"
                      ? "bg-green-500/10 text-green-400"
                      : meeting.status === "completed"
                      ? "bg-gray-700 text-gray-300"
                      : "bg-blue-500/10 text-blue-400"
                  }`}
                >
                  {meeting.status}
                </span>

                <button
                  onClick={() =>
                    navigate(`/meeting/${meeting._id}`)
                  }
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Create Meeting
                </button>

                <button
                title="Delete Meeting"
                  onClick={() => {
                    if (
                      confirm(
                        "Delete this meeting?"
                      )
                    ) {
                      deleteMutation.mutate(
                        meeting._id
                      )
                    }
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>

            </div>
          ))}
        </div>

      </div>
    </Layout>
  )
} 