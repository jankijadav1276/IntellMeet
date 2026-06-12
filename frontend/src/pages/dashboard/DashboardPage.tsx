import { useState } from "react"
import {
  Video,
  Plus,
  Clock,
  Users,
  BarChart2,
  Loader2,
  AlertCircle,
  Calendar,
  PlayCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import meetingService from "../../services/meetingService"
import useMeetingStore from "../../store/meetingStore"
import Layout from "../../components/common/Layout"
import type { Meeting } from "../../types"

const stats = [
  { label: "Meetings this week", value: "8", icon: Video },
  { label: "Hours in meetings", value: "6.5", icon: Clock },
  { label: "Team members", value: "12", icon: Users },
  { label: "Action items", value: "14", icon: BarChart2 },
]

const quickActions = [
  {
    title: "New Meeting",
    description: "Create a meeting instantly",
    icon: Plus,
    action: "new",
  },
  {
    title: "Join Meeting",
    description: "Enter an existing meeting",
    icon: PlayCircle,
    action: "join",
  },
  {
    title: "Schedule Meeting",
    description: "Plan a future meeting",
    icon: Calendar,
    action: "schedule",
  },
]

const recentActivities = [
  {
    id: 1,
    title: "Weekly Standup completed",
    time: "10 minutes ago",
  },
  {
    id: 2,
    title: "Project Review scheduled",
    time: "1 hour ago",
  },
  {
    id: 3,
    title: "Client Discussion created",
    time: "Today",
  },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { addMeeting } = useMeetingStore()

  const [showModal, setShowModal] = useState(false)
  const [newMeeting, setNewMeeting] = useState({ title: "", date: "", time: "" })
  const [formError, setFormError] = useState("")
 
  function handleQuickAction(action: string) {
  switch (action) {
    case "new":
      setShowModal(true)
      break

    case "join":
      navigate("/meetings")
      break

    case "schedule":
      setShowModal(true)
      break

    default:
      break
  }
}
  // ── Fetch meetings ──────────────────────────────────────────────────────────
  const {
    data: meetings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["meetings"],
    queryFn: meetingService.getMeetings,
  })

  // ── Create meeting ──────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: meetingService.createMeeting,
    onSuccess: (created) => {
      // Update React Query cache so list refreshes without a full refetch
      queryClient.setQueryData<Meeting[]>(["meetings"], (old = []) => [created, ...old])
      // Also sync into Zustand store
      addMeeting(created)
      closeModal()
    },
    onError: () => {
      setFormError("Failed to create meeting. Please try again.")
    },
  })

  function closeModal() {
    setShowModal(false)
    setNewMeeting({ title: "", date: "", time: "" })
    setFormError("")
  }

  function handleCreateMeeting(e: React.FormEvent) {
    e.preventDefault()
    setFormError("")

    if (!newMeeting.title.trim()) {
      setFormError("Meeting title is required.")
      return
    }
    if (!newMeeting.date || !newMeeting.time) {
      setFormError("Please pick a date and time.")
      return
    }

    createMutation.mutate({
      title: newMeeting.title.trim(),
      date: newMeeting.date,
      time: newMeeting.time,
    })
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Layout
      title="Dashboard"
      subtitle={new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
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

        {/* Quick Actions */}
      <div className="mb-8">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-white text-lg font-semibold">
      Quick Actions
    </h2>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {quickActions.map(({ title, description, icon: Icon, action }) => (
      <button
        key={title}
        onClick={() => handleQuickAction(action)}
        className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-left hover:border-blue-500 hover:bg-gray-900/80 transition"
      >
        <div className="bg-blue-600/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>

        <h3 className="text-white font-medium mb-1">
          {title}
        </h3>

        <p className="text-gray-400 text-sm">
          {description}
        </p>
      </button>
    ))}
  </div>
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

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-12 text-gray-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading meetings…
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="flex items-center gap-2 mx-6 my-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Could not load meetings. Is the backend running?
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && meetings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500 text-sm gap-2">
            <Video className="w-8 h-8 text-gray-700" />
            No meetings yet. Create your first one!
          </div>
        )}

        {/* Meeting rows */}
        {!isLoading && !isError && meetings.length > 0 && (
          <div className="divide-y divide-gray-800">
            {meetings.map((meeting: Meeting) => (
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

                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      meeting.status === "upcoming"
                        ? "bg-blue-500/10 text-blue-400"
                        : meeting.status === "live"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
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

                  {meeting.status === "live" && (
                    <button
                      onClick={() => navigate(`/meeting/${meeting._id}`)}
                      className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      Join Live
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
        )}
      </div>

      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl">
  <div className="px-6 py-4 border-b border-gray-800">
    <h2 className="text-white font-medium">
      Recent Activity
    </h2>
  </div>

  <div className="divide-y divide-gray-800">
    {recentActivities.map((activity) => (
      <div
        key={activity.id}
        className="px-6 py-4 hover:bg-gray-800/40 transition"
      >
        <p className="text-white text-sm">
          {activity.title}
        </p>

        <p className="text-gray-400 text-xs mt-1">
          {activity.time}
        </p>
      </div>
    ))}
  </div>
</div>

      {/* New Meeting Model */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-white font-semibold text-lg mb-4">New Meeting</h2>

            <div className="space-y-4">
              {/* Title */}
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

              {/* Date + Time */}
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

              {/* Inline error */}
              {formError && (
                <p className="text-red-400 text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {formError}
                </p>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={createMutation.isPending}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm py-2.5 rounded-lg transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateMeeting}
                  disabled={createMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating…
                    </>
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}