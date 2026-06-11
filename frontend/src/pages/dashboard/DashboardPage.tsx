import { useState } from "react"
import { Video, Plus, Clock, Users, BarChart2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import type { Meeting } from "../../types"
import Layout from "../../components/common/Layout"

const mockMeetings: Meeting[] = [
  {
    _id: "1",
    title: "Product Standup",
    hostId: "user1",
    participants: [],
    date: "Today, 10:00 AM",
    duration: "30 min",
    status: "upcoming"
  },
  {
    _id: "2",
    title: "Design Review",
    hostId: "user1",
    participants: [],
    date: "Today, 2:00 PM",
    duration: "60 min",
    status: "upcoming"
  },
  {
    _id: "3",
    title: "Sprint Planning",
    hostId: "user1",
    participants: [],
    date: "Yesterday, 11:00 AM",
    duration: "90 min",
    status: "completed"
  },
  {
    _id: "4",
    title: "Client Demo",
    hostId: "user1",
    participants: [],
    date: "Jun 5, 3:00 PM",
    duration: "45 min",
    status: "completed"
  },
]

const stats = [
  { label: "Meetings this week", value: "8", icon: Video },
  { label: "Hours in meetings", value: "6.5", icon: Clock },
  { label: "Team members", value: "12", icon: Users },
  { label: "Action items", value: "14", icon: BarChart2 },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    time: ""
  })

  function handleCreateMeeting(e: React.FormEvent) {
    e.preventDefault()
    console.log("Creating meeting:", newMeeting)
    setShowModal(false)
    setNewMeeting({ title: "", date: "", time: "" })
  }

  return (
    <Layout
      title="Dashboard"
      subtitle={new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })}
    >
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-sm">{label}</p>
              <div className="bg-gray-800 p-2 rounded-lg">
                <Icon className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <p className="text-white text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Meetings section */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-white font-medium">Meetings</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            New Meeting
          </button>
        </div>

        <div className="divide-y divide-gray-800">
          {mockMeetings.map((meeting: Meeting) => (
            <div
              key={meeting._id}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-800/50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gray-800 p-2.5 rounded-lg">
                  <Video className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{meeting.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {meeting.date} · {meeting.duration}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <Users className="w-3.5 h-3.5" />
                  {meeting.participants.length}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  meeting.status === "upcoming"
                    ? "bg-blue-500/10 text-blue-400"
                    : meeting.status === "live"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-gray-700 text-gray-400"
                }`}>
                  {meeting.status}
                </span>
                {meeting.status === "upcoming" && (
                  <button
                    onClick={() => navigate(`/meeting/${meeting._id}`)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition"
                  >
                    Join
                  </button>
                )}
                {meeting.status === "completed" && (
                  <button
                    onClick={() => navigate(`/meeting/${meeting._id}/summary`)}
                    className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded-lg transition"
                  >
                    Summary
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Meeting Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-white font-semibold text-lg mb-4">New Meeting</h2>
            <form onSubmit={handleCreateMeeting} className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-1.5">
                  Meeting title
                </label>
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  placeholder="e.g. Weekly Standup"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 text-sm font-medium block mb-1.5">Date</label>
                  <input
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm font-medium block mb-1.5">Time</label>
                  <input
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm py-2.5 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm py-2.5 rounded-lg transition"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </Layout>
  )
}