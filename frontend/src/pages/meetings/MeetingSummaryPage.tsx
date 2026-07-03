import { useEffect, useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useQuery, useMutation } from "@tanstack/react-query"
import {
ArrowLeft,

} from "lucide-react"

import Layout from "../../components/common/Layout"
import meetingService from "../../services/meetingService"
import type { ActionItem } from "../../types"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"



export default function MeetingSummaryPage() {
const { id } = useParams()
const navigate = useNavigate()

const location = useLocation()
const aiData = location.state

const [activeTab, setActiveTab] = useState<
  "summary" | "actions" | "decisions" | "transcript"
>("summary")
const [actionItems, setActionItems] = useState<ActionItem[]>([])
const [copied, setCopied] = useState(false)


const { data: meeting,isLoading } = useQuery({
queryKey: ["meeting", id],
queryFn: () => meetingService.getMeetingById(id!),
enabled: !!id,
})


const summaryData = meeting


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

const data = meeting
const completed =
  actionItems.filter(
    (i: any) =>
      i.status === "completed"
  ).length
  
if (isLoading) {
  return (
    <Layout
      title="Loading"
      subtitle="Fetching summary"
    >
      <div className="flex justify-center items-center h-96">
        Loading...
      </div>
    </Layout>
  )
}

function copySummary() {
navigator.clipboard.writeText(
  data?.summary || ""
)
setCopied(true)
setTimeout(() => setCopied(false), 2000)
}

return (
  <Layout
    title={meeting?.title ?? "Meeting Summary"}
    subtitle="AI-powered meeting insights and outcomes"
  >
    {/* Top Actions */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

      <button
        onClick={() => navigate("/meetings/history")}
        className="
          flex items-center gap-2
          text-gray-400
          hover:text-white
          transition
        "
      >
        <ArrowLeft size={18} />
        Back to History
      </button>

      <button
        onClick={copySummary}
        className="
          px-4 py-2
          bg-blue-600
          hover:bg-blue-500
          rounded-lg
          text-white
          transition
        "
      >
        {copied ? "Copied ✓" : "Copy Summary"}
      </button>

    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <p className="text-gray-400 text-sm">
          Action Items
        </p>

        <p className="text-3xl font-bold text-white mt-1">
          {actionItems.length}
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <p className="text-gray-400 text-sm">
          Completed Tasks
        </p>

        <p className="text-3xl font-bold text-green-400 mt-1">
          {completed}
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <p className="text-gray-400 text-sm">
          Key Decisions
        </p>

        <p className="text-3xl font-bold text-blue-400 mt-1">
          {data?.keyDecisions?.length || 0}
        </p>
      </div>

    </div>

    {/* Tabs */}
    <div className="flex flex-wrap gap-2 mb-6">

      {[
        "summary",
        "actions",
        "decisions",
      ].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab as any)}
          className={`
            px-4 py-2 rounded-lg capitalize transition
            ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
            }
          `}
        >
          {tab}
        </button>
      ))}

    </div>

    {/* Main Content */}
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

      {/* Summary */}
      {activeTab === "summary" && (
        <div>

          <h2 className="text-xl font-semibold text-white mb-4">
            AI Summary
          </h2>

<div className="bg-gray-800 rounded-xl p-6">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({ children }) => (
        <h1 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-3">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-2xl font-semibold text-blue-400 mt-8 mb-4">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-xl font-semibold text-white mt-6 mb-3">
          {children}
        </h3>
      ),
      p: ({ children }) => (
        <p className="text-gray-300 leading-8 mb-4">
          {children}
        </p>
      ),
      ul: ({ children }) => (
        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-5">
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-5">
          {children}
        </ol>
      ),
      li: ({ children }) => (
        <li className="leading-7">
          {children}
        </li>
      ),
      strong: ({ children }) => (
        <strong className="text-white font-semibold">
          {children}
        </strong>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-5">
          {children}
        </blockquote>
      ),
      code: ({ children }) => (
        <code className="bg-gray-900 px-1 py-0.5 rounded text-blue-300">
          {children}
        </code>
      ),
    }}
  >
    {data?.summary || "No summary available."}
  </ReactMarkdown>
</div>

        </div>
      )}

      {/* Actions */}
      {activeTab === "actions" && (
        <div>

          <h2 className="text-xl font-semibold text-white mb-4">
            Action Items
          </h2>

          {actionItems.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No action items generated.
            </div>
          ) : (
            <div className="space-y-3">

              {actionItems.map((item) => (

                <div
                  key={item._id}
                  className="
                    bg-gray-800
                    border border-gray-700
                    rounded-xl
                    p-4
                    flex
                    justify-between
                    items-center
                  "
                >
                  <div>

                    <p className="text-white">
                      {item.task}
                    </p>

                    {item.assignee && (
                      <p className="text-sm text-gray-400 mt-1">
                        Assigned to {item.assignee}
                      </p>
                    )}

                  </div>

                  <button
                    onClick={() =>
                      toggleItem.mutate({
                        itemId: item._id,
                        done: !item.done,
                      })
                    }
                    className={`
                      px-3 py-2 rounded-lg text-sm transition
                      ${
                        item.done
                          ? "bg-green-600 text-white"
                          : "bg-blue-600 text-white hover:bg-blue-500"
                      }
                    `}
                  >
                    {item.done ? "Completed" : "Mark Done"}
                  </button>

                </div>

              ))}

            </div>
          )}

        </div>
      )}

      {/* Decisions */}
      {activeTab === "decisions" && (
        <div>

          <h2 className="text-xl font-semibold text-white mb-4">
            Key Decisions
          </h2>

          {!data?.keyDecisions?.length ? (
            <div className="text-center py-10 text-gray-500">
              No decisions recorded.
            </div>
          ) : (
            <div className="space-y-3">

              {data.keyDecisions.map(
                (decision: string, index: number) => (
                  <div
                    key={index}
                    className="
                      bg-gray-800
                      border border-gray-700
                      rounded-xl
                      p-4
                    "
                  >
                    <p className="text-gray-200">
                      {decision}
                    </p>
                  </div>
                )
              )}

            </div>
          )}

        </div>
      )}

    </div>
  </Layout>
)
}