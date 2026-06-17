import { useState } from "react"
import { Plus, Search, Video, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Layout from "../../components/common/Layout"

const mockMeetings = [
  {
    id: "1",
    title: "Weekly Standup",
    type: "Team Meeting",
    dateTime: "2026-06-20T10:00:00",
    participants: 8,
  },
  {
    id: "2",
    title: "Project Review",
    type: "Review Session",
    dateTime: "2026-06-17T17:00:00",
    participants: 5,
  },
  {
    id: "3",
    title: "Client Discussion",
    type: "Client Meeting",
    dateTime: "2026-06-15T11:30:00",
    participants: 3,
  },
]
const getMeetingStatus = (meeting: any) => {
  const now = new Date()
  const meetingTime = new Date(meeting.dateTime)

  const meetingEnd = new Date(meetingTime)
  meetingEnd.setHours(meetingEnd.getHours() + 1)

  if (now >= meetingTime && now <= meetingEnd) {
    return "Live"
  }

  if (now < meetingTime) {
    return "Upcoming"
  }

  return "Completed"
}

export default function MeetingsPage() {
  const navigate = useNavigate()

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")

  const [showCreateModal, setShowCreateModal] = useState(false)

  const [meetingTitle, setMeetingTitle] = useState("")
  const [meetingDescription, setMeetingDescription] = useState("")
  const [meetingDate, setMeetingDate] = useState("")

 const filteredMeetings = mockMeetings
  .filter((meeting) =>
    meeting.title.toLowerCase().includes(search.toLowerCase())
  )
  .filter((meeting) => {
    const status = getMeetingStatus(meeting)

    if (filter === "All") return true

    return status === filter
  })

  return (
  <Layout title="Meetings">
    
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Meetings
            </h1>

            <p className="text-gray-400 mt-2">
              Manage and join your meetings
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            New Meeting
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">
              Total Meetings
            </p>
            <h3 className="text-3xl font-bold text-white mt-2">
              {mockMeetings.length}
            </h3>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">
              Live Meetings
            </p>
            <h3 className="text-3xl font-bold text-green-400 mt-2">
              {
               mockMeetings.filter(
               (m) => getMeetingStatus(m) === "Live"
               ).length
              }
            </h3>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">
              Upcoming
            </p>
            <h3 className="text-3xl font-bold text-blue-400 mt-2">
               {
                mockMeetings.filter(
                (m) => getMeetingStatus(m) === "Upcoming"
                ).length
               }
            </h3>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">
              Completed
            </p>
            <h3 className="text-3xl font-bold text-purple-400 mt-2">
              {
                mockMeetings.filter(
                  (m) => getMeetingStatus(m) === "Completed"
                ).length
              }
            </h3>
          </div>

        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search meetings..."
            className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {["All", "Live", "Upcoming", "Completed"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === item
                  ? "bg-blue-600 text-white"
                  : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Section Header */}
        {filteredMeetings.length > 0 && (
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Recent Meetings
            </h2>

            <span className="text-gray-400 text-sm">
              {filteredMeetings.length} meetings
            </span>
          </div>
        )}

        {/* Empty State */}
        {filteredMeetings.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-full bg-blue-600/10">
              <Video className="w-8 h-8 text-blue-400" />
            </div>

            <h3 className="text-white text-2xl font-semibold">
              No Meetings Found
            </h3>

            <p className="text-gray-400 mt-3 max-w-md mx-auto">
              You don't have any meetings matching your search or filter.
              Create a new meeting to get started.
            </p>

            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-xl text-white font-medium transition"
            >
              Create Meeting
            </button>
          </div>
        )}

       {/* Meeting Cards */}
{filteredMeetings.length > 0 && (
  <div className="grid gap-5">
    {filteredMeetings.map((meeting) => {
      const status = getMeetingStatus(meeting)

      return (
        <div
          key={meeting.id}
          className="group bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div className="flex gap-4">

              <div className="bg-blue-600/10 p-4 rounded-xl h-fit">
                <Video className="w-6 h-6 text-blue-400" />
              </div>

              <div>
                <h3 className="text-white text-lg font-semibold">
                  {meeting.title}
                </h3>

                <p className="text-blue-400 text-sm mt-1">
                  {meeting.type}
                </p>

                <p className="text-gray-400 text-sm mt-3">
                  {new Date(meeting.dateTime).toLocaleString()}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4 flex-wrap">

              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-4 h-4" />
                {meeting.participants} Participants
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  status === "Live"
                    ? "bg-green-500/10 text-green-400"
                    : status === "Completed"
                    ? "bg-purple-500/10 text-purple-400"
                    : "bg-yellow-500/10 text-yellow-400"
                }`}
              >
                {status}
              </span>

              <button
                disabled={status !== "Live"}
                onClick={() => {
                  if (status === "Live") {
                    navigate(`/meeting/${meeting.id}`)
                  }
                }}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                  status === "Live"
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : status === "Upcoming"
                    ? "bg-yellow-500/10 text-yellow-400 cursor-not-allowed"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                {status === "Live"
                  ? "Join Meeting"
                  : status === "Upcoming"
                  ? "Locked"
                  : "Meeting Ended"}
              </button>

            </div>

          </div>
        </div>
      )
    })}
  </div>
)}

        {/* Create Meeting Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg p-6">

              <h2 className="text-2xl font-bold text-white mb-6">
                Create Meeting
              </h2>

              <div className="space-y-4">

                <input
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="Meeting Title"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                />

                <textarea
                  rows={4}
                  value={meetingDescription}
                  onChange={(e) => setMeetingDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white resize-none"
                />

                <input
                  type="datetime-local"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                />

              </div>

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-700 rounded-lg text-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    console.log({
                      meetingTitle,
                      meetingDescription,
                      meetingDate,
                    })

                    setShowCreateModal(false)
                    setMeetingTitle("")
                    setMeetingDescription("")
                    setMeetingDate("")
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg"
                >
                  Create Meeting
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
    </Layout>
  )
}