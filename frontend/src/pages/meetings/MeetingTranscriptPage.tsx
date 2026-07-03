import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"

import Layout from "../../components/common/Layout"
import meetingService from "../../services/meetingService"

export default function MeetingTranscriptPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: meeting, isLoading } = useQuery({
    queryKey: ["meeting", id],
    queryFn: () => meetingService.getMeetingById(id!),
    enabled: !!id,
  })

  return (
    <Layout
      title="Meeting Transcript"
      subtitle={meeting?.title}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-4"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Loading State */}
      {isLoading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          
          {/* Transcript Available */}
          {meeting?.transcript?.length ? (
            <div className="space-y-6">
              {meeting.transcript.map((item: any, index: number) => (
                <div
                  key={index}
                  className="border-b border-gray-700 pb-4"
                >
                  <p className="text-blue-400 font-semibold">
                    🎤 {item.speaker}
                  </p>

                  <p className="text-white mt-2">
                    {item.text}
                  </p>

                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">
              No transcript available.
            </p>
          )}
        </div>
      )}
    </Layout>
  )
}