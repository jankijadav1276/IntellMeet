import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery, useMutation } from "@tanstack/react-query"
import {
ArrowLeft,
Loader2,
FileText,
CheckSquare,
Users,
Clock,
Copy,
Check,
Download,
Sparkles,
RefreshCw,
} from "lucide-react"

import Layout from "../../components/common/Layout"
import meetingService from "../../services/meetingService"
import type { ActionItem } from "../../types"

const MOCK_SUMMARY = {
summary:
"The team discussed sprint progress and resolved backend auth blockers.",
transcript:
"John: Let's start\nSarah: Backend is 80% done",
actionItems: [
{
_id: "1",
text: "Complete backend auth",
assignee: "Sarah",
dueDate: "2026-06-20",
done: false,
},
],
}

export default function MeetingSummaryPage() {
const { id } = useParams()
const navigate = useNavigate()

const [activeTab, setActiveTab] = useState<"summary" | "actions" | "transcript">("summary")
const [actionItems, setActionItems] = useState<ActionItem[]>([])
const [copied, setCopied] = useState(false)

const { data: meeting } = useQuery({
queryKey: ["meeting", id],
queryFn: () => meetingService.getMeetingById(id!),
enabled: !!id,
})

const { data: summaryData } = useQuery({
queryKey: ["summary", id],
queryFn: () => meetingService.getMeetingSummary(id!),
enabled: !!id,
placeholderData: MOCK_SUMMARY,
})

useEffect(() => {
if (summaryData?.actionItems) {
setActionItems(summaryData.actionItems)
}
}, [summaryData])

const toggleItem = useMutation({
mutationFn: async ({ itemId, done }: any) => ({ itemId, done }),
onSuccess: ({ itemId, done }) => {
setActionItems((prev) =>
prev.map((i) => (i._id === itemId ? { ...i, done } : i))
)
},
})

const data = summaryData ?? MOCK_SUMMARY
const completed = actionItems.filter((i) => i.done).length

function copySummary() {
navigator.clipboard.writeText(data.summary)
setCopied(true)
setTimeout(() => setCopied(false), 2000)
}

return (
<Layout title={meeting?.title ?? "Meeting Summary"} subtitle="AI insights">

{/* Header */}
<div className="flex justify-between items-center mb-4">

<button
onClick={() => navigate("/meetings")}
className="text-gray-400 hover:text-white"
>
<ArrowLeft />
</button>

<div className="flex gap-2">
<button onClick={copySummary} className="px-3 py-2 bg-gray-800 rounded-lg text-sm">
{copied ? "Copied" : "Copy"}
</button>
</div>

</div>

{/* Tabs */}
<div className="flex gap-2 mb-4">

<button onClick={() => setActiveTab("summary")}>Summary</button>
<button onClick={() => setActiveTab("actions")}>Actions</button>
<button onClick={() => setActiveTab("transcript")}>Transcript</button>

</div>

{/* Content */}
<div className="bg-gray-900 border border-gray-800 rounded-xl p-5">

{activeTab === "summary" && (
<p className="text-gray-300">{data.summary}</p>
)}

{activeTab === "actions" && (
<div className="space-y-3">
{actionItems.map((item) => (
<div key={item._id} className="flex justify-between bg-gray-800 p-3 rounded-lg">
<span>{item.text}</span>
<button
onClick={() =>
toggleItem.mutate({ itemId: item._id, done: !item.done })
}
className="text-blue-400"
>
{item.done ? "Done" : "Mark"}
</button>
</div>
))}
</div>
)}

{activeTab === "transcript" && (
<pre className="text-gray-400 whitespace-pre-wrap">
{data.transcript}
</pre>
)}

</div>

</Layout>
)
}