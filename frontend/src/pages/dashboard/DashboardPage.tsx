import { useState } from "react"
import {
  Plus,
  Users,
  Loader2,
  AlertCircle,
  Calendar,
  PlayCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import meetingService from "../../services/meetingService"
import useMeetingStore from "../../store/meetingStore"
import useAuthStore from "../../store/authStore"
import Layout from "../../components/common/Layout"
import type { Meeting } from "../../types"

export default function DashboardPage(){

const navigate=useNavigate()
const user=useAuthStore((state)=>state.user)

const queryClient=useQueryClient()
const {addMeeting}=useMeetingStore()

  const [showModal, setShowModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinCode, setJoinCode] = useState("")

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: "",
    time: "",
    duration: 30,
  })

  const [formError, setFormError] = useState("")

  /* ───────── Quick Actions ───────── */
  function handleQuickAction(action: string) {
    if (action === "new" || action === "schedule") {
      setShowModal(true)
    } else if (action === "join") {
      setShowJoinModal(true)
    }
  }

  /* ───────── Fetch Meetings ───────── */
  const {
    data: meetings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["meetings"],
    queryFn: meetingService.getMyMeetings,
  })

  const scheduledCount = meetings.filter(
  (meeting: Meeting) => meeting.status === "scheduled"
).length

const activeCount = meetings.filter(
  (meeting: Meeting) => meeting.status === "active"
).length

const completedCount = meetings.filter(
  (meeting: Meeting) => meeting.status === "completed"
).length

  /* ───────── Create Meeting ───────── */
  const createMutation = useMutation({
    mutationFn: meetingService.createMeeting,
    onSuccess: (created: Meeting) => {
      queryClient.setQueryData<Meeting[]>(["meetings"], (old = []) => [
        created,
        ...old,
      ])
      addMeeting(created)
      closeModal()
    },
    onError: () => {
      setFormError("Failed to create meeting. Try again.")
    },
  })

  /* ───────── Helpers ───────── */
  function closeModal() {
    setShowModal(false)
    setNewMeeting({ title: "", date: "", time: "", duration: 30 })
    setFormError("")
  }

function handleCreateMeeting(e:React.FormEvent){
e.preventDefault()

    if (!newMeeting.title.trim()) {
      setFormError("Title is required")
      return
    }

    if (!newMeeting.date || !newMeeting.time) {
      setFormError("Date and time required")
      return
    }

    const startTime = new Date(
      `${newMeeting.date}T${newMeeting.time}:00`
    ).toISOString()

    createMutation.mutate({
      title: newMeeting.title.trim(),
      startTime,
      duration: newMeeting.duration,
    })
  }

  /* ───────── UI ───────── */
  return (
    <Layout title="Dashboard" subtitle={new Date().toLocaleDateString()}>

      {/* STATS */}
{/* STATS */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
    <p className="text-gray-400 text-sm">
      Total Meetings
    </p>
    <p className="text-3xl font-bold text-white">
      {meetings.length}
    </p>
  </div>

  {/* Scheduled */}
  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5">
    <p className="text-purple-300 text-sm">
      Scheduled
    </p>

    <p className="text-3xl font-bold text-purple-400 mt-2">
      {scheduledCount}
    </p>
  </div>

  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5">
    <p className="text-green-300 text-sm">
      Active
    </p>
    <p className="text-3xl font-bold text-green-400">
      {activeCount}
    </p>
  </div>

  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
    <p className="text-blue-300 text-sm">
      Completed
    </p>
    <p className="text-3xl font-bold text-blue-400">
      {completedCount}
    </p>
  </div>

</div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { title: "New Meeting", action: "new", icon: Plus },
          { title: "Join Meeting", action: "join", icon: PlayCircle },
          { title: "Schedule", action: "schedule", icon: Calendar },
        ].map(({ title, action, icon: Icon }) => (
          <button
            key={action}
            onClick={() => handleQuickAction(action)}
            className="bg-gray-900 border border-gray-800 p-5 rounded-xl text-left"
          >
            <Icon className="text-blue-400 mb-2" />
            <p className="text-white">{title}</p>
          </button>
        ))}
      </div>

      {/* MEETINGS LIST */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-white">Meetings</h2>
        </div>

        {isLoading && (
          <div className="p-6 text-gray-400 flex gap-2">
            <Loader2 className="animate-spin" />
            Loading...
          </div>
        )}

        {isError && (
          <div className="p-4 text-red-400 flex gap-2">
            <AlertCircle />
            Failed to load meetings
          </div>
        )}

        {!isLoading && meetings.length === 0 && (
          <div className="p-8 text-gray-500 text-center">
            No meetings found
          </div>
        )}

        {meetings.map((meeting: Meeting) => (
          <div
            key={meeting._id}
            className="p-4 border-t border-gray-800 flex justify-between"
          >
            <div>
              <p className="text-white">{meeting.title}</p>
              <p className="text-gray-400 text-sm">
                {new Date(meeting.startTime).toLocaleString()} ·{" "}
                {meeting.duration} min
              </p>
            </div>

            <div className="flex gap-3 items-center">
              <Users className="text-gray-400 w-4 h-4" />

              <span className="text-gray-400 text-sm">
                {meeting.participants?.length || 0}
              </span>

<span
  className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
    meeting.status === "scheduled"
      ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
      : meeting.status === "active"
      ? "bg-green-500/15 text-green-300 border border-green-500/30"
      : meeting.status === "completed"
      ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
      : meeting.status === "cancelled"
      ? "bg-red-500/15 text-red-300 border border-red-500/30"
      : "bg-gray-700 text-gray-300"
  }`}
>
  {meeting.status}
</span>

              <button
                onClick={() => navigate(`/meetings/${meeting._id}`)}
                className="bg-blue-600 px-3 py-1 text-white rounded"
              >
                Join
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-xl w-[420px]">

            <h2 className="text-white mb-4">Create Meeting</h2>

            <label htmlFor="title" className="text-sm text-gray-300">
              Meeting Title
            </label>
            <input
              id="title"
              className="w-full mb-3 p-2 bg-gray-800 text-white rounded"
              value={newMeeting.title}
              onChange={(e) =>
                setNewMeeting({ ...newMeeting, title: e.target.value })
              }
            />

            <label htmlFor="date" className="text-sm text-gray-300">
              Date
            </label>
            <input
              id="date"
              type="date"
              className="w-full mb-3 p-2 bg-gray-800 text-white rounded"
              value={newMeeting.date}
              onChange={(e) =>
                setNewMeeting({ ...newMeeting, date: e.target.value })
              }
            />

            <label htmlFor="time" className="text-sm text-gray-300">
              Time
            </label>
            <input
              id="time"
              type="time"
              className="w-full mb-3 p-2 bg-gray-800 text-white rounded"
              value={newMeeting.time}
              onChange={(e) =>
                setNewMeeting({ ...newMeeting, time: e.target.value })
              }
            />

            <label htmlFor="duration" className="text-sm text-gray-300">
              Duration
            </label>
            <input
              id="duration"
              type="number"
              className="w-full mb-3 p-2 bg-gray-800 text-white rounded"
              value={newMeeting.duration}
              onChange={(e) =>
                setNewMeeting({
                  ...newMeeting,
                  duration: Number(e.target.value),
                })
              }
            />

            {formError && (
              <p className="text-red-400 text-sm mb-2">{formError}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={closeModal}
                className="flex-1 bg-gray-700 p-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateMeeting}
                className="flex-1 bg-blue-600 p-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JOIN MODAL */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-xl w-[400px]">

            <h2 className="text-white mb-4">Join Meeting</h2>

            <label htmlFor="code" className="text-sm text-gray-300">
              Meeting Code
            </label>
            <input
              id="code"
              placeholder="Enter code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white rounded mb-3"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 bg-gray-700 p-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (!joinCode.trim()) return
                  navigate(`/meetings/${joinCode}`)
                }}
                className="flex-1 bg-blue-600 p-2 rounded"
              >
                Join
              </button>
            </div>

          </div>
        </div>
      )}

    </Layout>
  )
}