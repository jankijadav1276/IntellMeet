import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery, useMutation } from "@tanstack/react-query"
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
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

// ── Mock data shown when backend is not ready ─────────────────────────────────
// Remove this once backend is live
const MOCK_SUMMARY = {
  summary:
    "The team discussed the current sprint progress and identified two blockers related to the authentication module. Sarah confirmed the backend APIs for user login are 80% complete. Alex presented the updated UI components for the dashboard. The team agreed to prioritize the meeting room WebRTC integration for the next sprint. A follow-up demo is scheduled for Friday.",
  transcript: `John: Good morning everyone, let's get started with today's standup.
Sarah: The backend auth APIs are nearly done, around 80% complete. I'm blocked on the JWT refresh token logic.
Alex: Frontend dashboard components are ready. I've pushed the PR, waiting for review.
John: Great. Let's prioritize the WebRTC integration this sprint — it's the core feature.
Emma: I can help with testing once the video tiles are rendering correctly.
John: Perfect. Let's schedule a demo for Friday to show progress to stakeholders.
Sarah: Sounds good. I'll have the auth APIs done by Thursday.
Alex: I'll finish the review today and start on the meeting room page.
John: Excellent. That's a wrap — see everyone Friday!`,
  actionItems: [
    {
      _id: "1",
      text: "Complete JWT refresh token implementation",
      assignee: "Sarah",
      dueDate: "2026-06-13",
      done: false,
    },
    {
      _id: "2",
      text: "Review and merge dashboard PR",
      assignee: "Alex",
      dueDate: "2026-06-11",
      done: true,
    },
    {
      _id: "3",
      text: "Implement WebRTC peer connection logic",
      assignee: "Alex",
      dueDate: "2026-06-14",
      done: false,
    },
    {
      _id: "4",
      text: "Set up Friday demo environment",
      assignee: "John",
      dueDate: "2026-06-13",
      done: false,
    },
  ],
}

export default function MeetingSummaryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"summary" | "transcript" | "actions">("summary")
  const [actionItems, setActionItems] = useState<ActionItem[]>([])

  // ── Fetch meeting details ────────────────────────────────────────────────
  const {
    data: meeting,
    isLoading: meetingLoading,
    isError: meetingError,
  } = useQuery({
    queryKey: ["meeting", id],
    queryFn: () => meetingService.getMeetingById(id!),
    enabled: !!id,
  })

  // ── Fetch AI summary ─────────────────────────────────────────────────────
  const {
    data: summaryData,
    isLoading: summaryLoading,
    isError: summaryError,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ["meeting-summary", id],
    queryFn: () => meetingService.getMeetingSummary(id!),
    enabled: !!id,
    // Use mock data as fallback if backend fails
    placeholderData: MOCK_SUMMARY,
    retry: 1,
  })

  // ── Toggle action item done/undone ───────────────────────────────────────
  const toggleActionItem = useMutation({
    mutationFn: async ({ itemId, done }: { itemId: string; done: boolean }) => {
      // Will call PATCH /api/meetings/:id/action-items/:itemId when backend ready
      return { itemId, done }
    },
    onSuccess: ({ itemId, done }) => {
      setActionItems((prev) =>
        prev.map((item) => (item._id === itemId ? { ...item, done } : item))
      )
    },
  })

  // ── Copy summary to clipboard ────────────────────────────────────────────
  async function copySummary() {
    const text = summaryData?.summary ?? MOCK_SUMMARY.summary
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Export summary as .txt ───────────────────────────────────────────────
  function exportSummary() {
    const data = summaryData ?? MOCK_SUMMARY
    const items = (data.actionItems ?? MOCK_SUMMARY.actionItems)
      .map((i: ActionItem) => `  [${i.done ? "x" : " "}] ${i.text} — ${i.assignee}${i.dueDate ? ` (due ${i.dueDate})` : ""}`)
      .join("\n")

    const content = `MEETING SUMMARY — ${meeting?.title ?? "Meeting"}
Date: ${meeting?.date ?? ""}
Duration: ${meeting?.duration ?? ""}

SUMMARY
-------
${data.summary}

ACTION ITEMS
------------
${items}

TRANSCRIPT
----------
${data.transcript}
`
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${meeting?.title ?? "meeting"}-summary.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ── Use real data or fallback to mock ────────────────────────────────────
  const displayData = summaryError ? MOCK_SUMMARY : (summaryData ?? MOCK_SUMMARY)
  const displayActionItems =
    actionItems.length > 0
      ? actionItems
      : (displayData.actionItems as ActionItem[]) ?? []

  // Sync actionItems state on first load
  if (actionItems.length === 0 && displayData.actionItems?.length > 0) {
    setActionItems(displayData.actionItems as ActionItem[])
  }

  const completedCount = displayActionItems.filter((i) => i.done).length

  // ── Loading ───────────────────────────────────────────────────────────────
  if (meetingLoading) {
    return (
      <Layout title="Meeting Summary" subtitle="AI-powered insights">
        <div className="flex items-center justify-center gap-2 py-32 text-gray-400 text-sm">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading summary…
        </div>
      </Layout>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (meetingError || !meeting) {
    return (
      <Layout title="Meeting Summary" subtitle="Error">
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Could not load this meeting summary.
          </div>
          <button
            onClick={() => navigate("/meetings")}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            ← Back to Meetings
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Meeting Summary" subtitle="AI-powered insights">
      <div className="space-y-6">

        {/* Back + header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate("/meetings")}
              className="mt-1 text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-white text-xl font-semibold">{meeting.title}</h1>
              <p className="text-gray-400 text-sm mt-0.5">
                {meeting.date} · {meeting.duration}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetchSummary()}
              className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-3 py-2 rounded-lg transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Regenerate
            </button>
            <button
              onClick={copySummary}
              className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-3 py-2 rounded-lg transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={exportSummary}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-2 rounded-lg transition"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Participants</p>
              <p className="text-white font-semibold">{meeting.participants.length || 4}</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-green-500/10 p-2 rounded-lg">
              <Clock className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Duration</p>
              <p className="text-white font-semibold">{meeting.duration || "45 min"}</p>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
            <div className="bg-purple-500/10 p-2 rounded-lg">
              <CheckSquare className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Action Items</p>
              <p className="text-white font-semibold">
                {completedCount}/{displayActionItems.length} done
              </p>
            </div>
          </div>
        </div>

        {/* AI badge */}
        {summaryError && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-xs">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            Backend not connected — showing sample AI summary for demo purposes.
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
          {([
            { key: "summary",    label: "Summary",    icon: Sparkles },
            { key: "actions",    label: "Action Items", icon: CheckSquare },
            { key: "transcript", label: "Transcript", icon: FileText },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
                activeTab === key
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

          {/* Summary tab */}
          {activeTab === "summary" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h2 className="text-white font-medium">AI-Generated Summary</h2>
                {summaryLoading && <Loader2 className="w-3.5 h-3.5 text-gray-400 animate-spin" />}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {displayData.summary}
              </p>
            </div>
          )}

          {/* Action items tab */}
          {activeTab === "actions" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-purple-400" />
                  <h2 className="text-white font-medium">Action Items</h2>
                </div>
                <span className="text-gray-400 text-xs">
                  {completedCount} of {displayActionItems.length} completed
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{
                    width: displayActionItems.length
                      ? `${(completedCount / displayActionItems.length) * 100}%`
                      : "0%",
                  }}
                />
              </div>

              {displayActionItems.map((item) => (
                <div
                  key={item._id}
                  className={`flex items-start gap-3 p-4 rounded-lg border transition ${
                    item.done
                      ? "border-gray-700 bg-gray-800/30 opacity-60"
                      : "border-gray-700 bg-gray-800/50"
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() =>
                      toggleActionItem.mutate({ itemId: item._id, done: !item.done })
                    }
                    className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition ${
                      item.done
                        ? "bg-blue-600 border-blue-600"
                        : "border-gray-600 hover:border-blue-400"
                    }`}
                  >
                    {item.done && <Check className="w-3 h-3 text-white" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${item.done ? "line-through text-gray-500" : "text-gray-200"}`}>
                      {item.text}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-blue-400">@{item.assignee}</span>
                      {item.dueDate && (
                        <span className="text-xs text-gray-500">Due {item.dueDate}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Transcript tab */}
          {activeTab === "transcript" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-green-400" />
                <h2 className="text-white font-medium">Meeting Transcript</h2>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                {displayData.transcript
                  .split("\n")
                  .filter(Boolean)
                  .map((line: string, i: number) => {
                    // Try to split "Name: message"
                    const colonIndex = line.indexOf(":")
                    const speaker = colonIndex > -1 ? line.slice(0, colonIndex) : null
                    const message = colonIndex > -1 ? line.slice(colonIndex + 1).trim() : line

                    return (
                      <div key={i} className="mb-3">
                        {speaker && (
                          <span className="text-blue-400 text-xs font-medium">{speaker}: </span>
                        )}
                        <span className="text-gray-300 text-sm">{message}</span>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  )
}