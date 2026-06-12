import { Plus, Search, Video, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Layout from "../../components/common/Layout"

const mockMeetings = [
  {
    id: "1",
    title: "Weekly Standup",
    date: "2026-06-13",
    participants: 8,
    status: "Upcoming",
  },
  {
    id: "2",
    title: "Project Review",
    date: "2026-06-14",
    participants: 5,
    status: "Live",
  },
  {
    id: "3",
    title: "Client Discussion",
    date: "2026-06-15",
    participants: 3,
    status: "Upcoming",
  },
]

export default function MeetingsPage() {
  const navigate = useNavigate()

  return (
    <Layout
      title="Meetings"
      subtitle="Manage and join your meetings"
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 w-full md:max-w-md">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search meetings..."
              className="bg-transparent outline-none text-white flex-1"
            />
          </div>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl transition">
            <Plus className="w-4 h-4" />
            New Meeting
          </button>
        </div>

        <div className="grid gap-4">
          {mockMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="bg-gray-800 p-3 rounded-lg">
                  <Video className="w-5 h-5 text-blue-400" />
                </div>

                <div>
                  <h3 className="text-white font-medium">
                    {meeting.title}
                  </h3>

                  <p className="text-gray-400 text-sm mt-1">
                    {meeting.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Users className="w-4 h-4" />
                  {meeting.participants}
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    meeting.status === "Live"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-blue-500/10 text-blue-400"
                  }`}
                >
                  {meeting.status}
                </span>

                <button
                  onClick={() => navigate(`/meeting/${meeting.id}`)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}