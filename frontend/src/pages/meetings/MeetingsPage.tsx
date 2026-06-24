import { useState } from "react"
import { Search, Video, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Layout from "../../components/common/Layout"
import PageWrapper from "../../components/common/PageWrapper"

import { useQuery } from "@tanstack/react-query"
import meetingService from "../../services/meetingService"

const getMeetingStatus = (meeting: any) => {
const now = new Date()
const meetingTime = new Date(meeting.startTime)

const meetingEnd = new Date(meetingTime)
meetingEnd.setHours(meetingEnd.getHours() + 1)

if (now >= meetingTime && now <= meetingEnd) return "Live"
if (now < meetingTime) return "Upcoming"
return "Completed"
}

export default function MeetingsPage() {
const navigate = useNavigate()

const [search, setSearch] = useState("")
const [filter, setFilter] = useState("All")

// ===============================
// BACKEND INTEGRATION
// ===============================
const { data: meetings = [], isLoading, isError } = useQuery({
queryKey: ["myMeetings"],
queryFn: meetingService.getMyMeetings,
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

return (
<Layout>
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
className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between items-center"
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
className={`px-3 py-1 rounded-full text-xs ${
status === "Live"
? "bg-green-500/10 text-green-400"
: status === "Upcoming"
? "bg-blue-500/10 text-blue-400"
: "bg-gray-700 text-gray-300"
}`}
>
{status}
</span>

<button
onClick={() =>
navigate(`/meeting/${meeting.meetingCode}`)
}
className={`px-4 py-2 rounded-lg text-sm ${
status === "Live"
? "bg-blue-600 text-white"
: "bg-gray-700 text-gray-400 cursor-not-allowed"
}`}
disabled={status !== "Live"}
>
{status === "Live" ? "Join" : "Locked"}
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