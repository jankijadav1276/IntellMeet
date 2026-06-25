import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Calendar,
  Clock,
  Download,
  FileText,
  CheckSquare,
  PlayCircle,
} from "lucide-react"

import Layout from "../../components/common/Layout"
import recordingService from "../../services/recordingService"
import type { Recording } from "../../types/recording"

export default function RecordingDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const {
    data: recording,
    isLoading,
    isError,
    refetch,
  } = useQuery<Recording>({
    queryKey: ["recording", id],
    queryFn: () => recordingService.getRecordingById(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <Layout title="Recording" subtitle="Loading recording details">
        <div className="flex justify-center items-center h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
      </Layout>
    )
  }

  if (isError || !recording) {
    return (
      <Layout title="Recording" subtitle="Recording details">
        <div
          className="
            bg-red-500/10
            border
            border-red-500/20
            rounded-2xl
            p-8
            text-center
          "
        >
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />

          <h2 className="text-xl font-semibold text-white mb-2">
            Recording Not Found
          </h2>

          <p className="text-gray-400 mb-6">
            Unable to load this recording.
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => refetch()}
              className="
                px-4
                py-2
                rounded-lg
                bg-blue-600
                hover:bg-blue-700
              "
            >
              Retry
            </button>

            <button
              onClick={() => navigate("/recordings")}
              className="
                px-4
                py-2
                rounded-lg
                bg-gray-800
                hover:bg-gray-700
              "
            >
              Back
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout
       title={`Meeting ${recording.meetingId}`}
       subtitle="Recording details"
       >
      {/* Header */}
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <button
          onClick={() => navigate("/recordings")}
          className="
            flex
            items-center
            gap-2
            text-gray-400
            hover:text-white
          "
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Recordings
        </button>

        {recording.videoUrl && (
          <a
           href={`http://localhost:5000${recording.videoUrl}`} 
            target="_blank"
            rel="noreferrer"
            className="
              flex
              items-center
              gap-2
              px-4
              py-2
              rounded-lg
              bg-blue-600
              hover:bg-blue-700
            "
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        )}
      </div>

      {/* Recording Info */}
      <div
        className="
          bg-gray-900
          border
          border-gray-800
          rounded-2xl
          p-5
          mb-6
        "
      >
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Status</p>

            <p className="text-white font-medium mt-1">
              {recording.status}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Created</p>

            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-gray-400" />

              <span>
                {new Date(recording.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Duration</p>

            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-gray-400" />

              <span>
                {recording.duration
                  ? `${Math.floor(recording.duration / 60)} min`
                  : "Unknown"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div
        className="
          bg-gray-900
          border
          border-gray-800
          rounded-2xl
          overflow-hidden
          mb-6
        "
      >
        <div className="p-4 border-b border-gray-800">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <PlayCircle className="w-5 h-5" />
            Recording Playback
          </h3>
        </div>

        <div className="p-4">
          {recording.videoUrl ? (
            <video
    controls
    className="w-full rounded-xl"
  >
    <source
      src={`http://localhost:5000${recording.videoUrl}`}
      type="video/webm"
    />
  </video>
          ) : (
            <div
              className="
                h-64
                flex
                items-center
                justify-center
                bg-gray-800
                rounded-xl
              "
            >
              <p className="text-gray-500">
                Recording file unavailable
              </p>
            </div>
          )}
        </div>
      </div>

    </Layout>
  )
}