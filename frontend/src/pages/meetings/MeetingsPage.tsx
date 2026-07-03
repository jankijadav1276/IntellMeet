import { useState } from "react"
import { Search, Users, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Layout from "../../components/common/Layout"
import PageWrapper from "../../components/common/PageWrapper"

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import meetingService from "../../services/meetingService"

const getMeetingStatus = (meeting: any) => {
  switch (meeting.status) {
    case "active":
      return "Live"

    case "scheduled":
      return "Upcoming"

    case "completed":
      return "Completed"

    default:
      return "Completed"
  }
}

export default function MeetingsPage() {
const navigate = useNavigate()

const queryClient = useQueryClient()

const [search, setSearch] = useState("")
const [filter, setFilter] = useState("All")

// ===============================
// BACKEND INTEGRATION
// ===============================
const { data: meetings = [], isLoading, isError } = useQuery({
queryKey: ["myMeetings"],
queryFn: meetingService.getMyMeetings,
})

const deleteMeetingMutation = useMutation({
  mutationFn: (id: string) =>
    meetingService.deleteMeeting(id),

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["myMeetings"],
    })
  },
})

// ===============================
// FILTERED MEETINGS
// ===============================
const filteredMeetings = meetings
.filter((m: any) =>
m.title.toLowerCase().includes(search.toLowerCase())
)
.filter((m: any) => {
const status = getMeetingStatus(m)
return filter === "All" || status === filter
})

const handleDeleteMeeting = (id: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this meeting?"
  )

  if (!confirmed) return

  deleteMeetingMutation.mutate(id)
}

return (
<Layout title="Meetings">
<PageWrapper>

{/* HEADER (NO CREATE BUTTON - REMOVED AS REQUESTED) */}
<div className="flex items-center justify-between mb-6">
<h2 className="text-xl font-semibold text-white">
Meetings
</h2>
</div>

{/* SEARCH */}
<div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 w-full md:max-w-md mb-6">
<Search className="w-4 h-4 text-gray-500" />

<input
type="text"
placeholder="Search meetings..."
value={search}
onChange={(e) => setSearch(e.target.value)}
className="bg-transparent outline-none text-white flex-1"
/>
</div>

{/* FILTER BUTTONS */}
<div className="flex gap-3 mb-6">
{["All", "Live", "Upcoming", "Completed"].map((f) => (
<button
key={f}
onClick={() => setFilter(f)}
className={`px-4 py-2 rounded-lg text-sm ${
filter === f
? "bg-blue-600 text-white"
: "bg-gray-800 text-gray-400"
}`}
>
{f}
</button>
))}
</div>

{/* LOADING */}
{isLoading && (
<div className="text-gray-400">Loading meetings...</div>
)}

{/* ERROR */}
{isError && (
<div className="text-red-400">Failed to load meetings</div>
)}

{/* EMPTY STATE */}
{!isLoading && filteredMeetings.length === 0 && (
<div className="text-gray-400 text-center mt-10">
No meetings found
</div>
)}

{/* MEETINGS LIST */}
<div className="grid gap-4">
{filteredMeetings.map((meeting: any) => {
const status = getMeetingStatus(meeting)

return (
<div
key={meeting._id}
className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-xl p-5 flex justify-between items-center hover:border-blue-500/40 transition-all duration-300 shadow-lg"
>
{/* LEFT */}
<div>
<h3 className="text-white font-semibold">
{meeting.title}
</h3>

<p className="text-gray-400 text-sm">
{new Date(meeting.startTime).toLocaleString()}
</p>

<p className="text-gray-500 text-xs">
Code: {meeting.meetingCode}
</p>
</div>

{/* RIGHT */}
<div className="flex items-center gap-4">

<div className="flex items-center gap-2 text-gray-400 text-sm">
<Users className="w-4 h-4" />
{meeting.participants?.length || 0}
</div>

<span
  className={`px-3 py-1 rounded-full text-xs font-medium border ${
    status === "Live"
      ? "bg-green-500/20 text-green-300 border-green-500/40"

      : status === "Upcoming"
      ? "bg-purple-500/20 text-purple-300 border-purple-500/40"

      : "bg-blue-500/20 text-blue-300 border-blue-500/40"
  }`}
>
  {status}
</span>

<button
  onClick={() =>
    navigate(`/meeting/${meeting.meetingCode}`)
  }
  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
    status === "Completed"
      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
      : "bg-blue-600 hover:bg-blue-700 text-white"
  }`}
  disabled={status === "Completed"}
>
  {status === "Completed" ? "Locked" : "Join"}
</button>

<button
  onClick={() =>
    handleDeleteMeeting(meeting._id)
  }
  disabled={deleteMeetingMutation.isPending}
  className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white transition-all"
  title="Delete Meeting"
>
  <Trash2 className="w-5 h-5" />
</button>


</div>
</div>
)
})}
</div>

</PageWrapper>
</Layout>
)
}