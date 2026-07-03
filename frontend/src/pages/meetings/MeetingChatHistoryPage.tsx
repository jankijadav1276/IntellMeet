import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, MessageSquare } from "lucide-react"

import Layout from "../../components/common/Layout"
import meetingService from "../../services/meetingService"

export default function MeetingChatHistoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: meeting, isLoading } = useQuery({
    queryKey: ["meeting", id],
    queryFn: () => meetingService.getMeetingById(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <Layout
        title="Chat History"
        subtitle="Loading meeting chat"
      >
        <div className="flex items-center justify-center h-96">
          Loading...
        </div>
      </Layout>
    )
  }

  const chats = meeting?.chats || []

  return (
    <Layout
      title="Meeting Chat History"
      subtitle="View conversation from the meeting"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
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
          Back
        </button>
      </div>

      {/* Meeting Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Meeting
          </p>

          <h2 className="text-xl font-semibold text-white mt-1">
            {meeting?.title}
          </h2>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm">
            Total Messages
          </p>

          <h2 className="text-3xl font-bold text-blue-400 mt-1">
            {chats.length}
          </h2>
        </div>

      </div>

      {/* Empty State */}
      {chats.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">

          <MessageSquare
            size={50}
            className="mx-auto text-gray-500 mb-4"
          />

          <h2 className="text-xl font-semibold text-white">
            No Messages Found
          </h2>

          <p className="text-gray-400 mt-2">
            No chat messages were sent during this meeting.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {chats.map((chat: any, index: number) => (

            <div
              key={index}
              className="
                bg-gray-900
                border
                border-gray-800
                rounded-xl
                p-5
              "
            >
              <div className="flex justify-between items-center mb-3">

                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-10 h-10
                      rounded-full
                      bg-blue-600
                      flex items-center
                      justify-center
                      text-white
                      font-semibold
                    "
                  >
                    {chat.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div>
                    <p className="font-medium text-white">
                      {chat.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {new Date(
                        chat.timestamp
                      ).toLocaleString()}
                    </p>
                  </div>

                </div>

              </div>

              <div
                className="
                  bg-gray-800
                  rounded-lg
                  p-4
                  text-gray-200
                  whitespace-pre-wrap
                  break-words
                "
              >
                {chat.message}
              </div>

            </div>

          ))}

        </div>
      )}
    </Layout>
  )
}