import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  Search,
  Film,
  Calendar,
  Clock,
  Eye,
  Loader2,
  AlertCircle,
  Video,
} from "lucide-react"

import Layout from "../../components/common/Layout"
import recordingService from "../../services/recordingService"
import type { Recording } from "../../types/recording"

export default function RecordingsPage() {
  const navigate = useNavigate()

  const [search, setSearch] = useState("")

  const {
    data: recordings = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Recording[]>({
    queryKey: ["recordings"],
    queryFn: recordingService.getRecordings,
  })

  const filteredRecordings = useMemo(() => {
    return recordings.filter((recording) =>
      recording.title?.toLowerCase().includes(search.toLowerCase())
    )
  }, [recordings, search])

  return (
    <Layout
      title="Recordings"
      subtitle="View and manage your meeting recordings"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Meeting Recordings
          </h2>

          <p className="text-gray-400 mt-1">
            Access recordings, transcripts and summaries
          </p>
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />

          <input
            type="text"
            placeholder="Search recordings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              pl-10
              pr-4
              py-3
              rounded-xl
              bg-gray-900
              border
              border-gray-800
              text-white
              outline-none
              focus:border-blue-500
            "
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div
          className="
            h-[400px]
            flex
            items-center
            justify-center
          "
        >
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          className="
            bg-red-500/10
            border
            border-red-500/20
            rounded-xl
            p-6
            flex
            flex-col
            items-center
            gap-3
          "
        >
          <AlertCircle className="w-10 h-10 text-red-500" />

          <h3 className="text-white font-semibold">
            Failed to load recordings
          </h3>

          <button
            onClick={() => refetch()}
            className="
              px-4
              py-2
              bg-blue-600
              rounded-lg
              text-white
            "
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredRecordings.length === 0 && (
        <div
          className="
            bg-gray-900
            border
            border-gray-800
            rounded-2xl
            p-12
            text-center
          "
        >
          <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />

          <h3 className="text-xl font-semibold text-white">
            No Recordings Found
          </h3>

          <p className="text-gray-400 mt-2">
            Recordings will appear here after meetings are recorded.
          </p>
        </div>
      )}

      {/* Recordings Grid */}
      {!isLoading &&
        !isError &&
        filteredRecordings.length > 0 && (
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-5
            "
          >
            {filteredRecordings.map((recording) => (
              <div
                key={recording._id}
                className="
                  bg-gray-900
                  border
                  border-gray-800
                  rounded-2xl
                  p-5
                  hover:border-blue-500/40
                  transition
                "
              >
                {/* Title */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3">
                    <div
                      className="
                        w-12
                        h-12
                        rounded-xl
                        bg-blue-500/10
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Film className="w-6 h-6 text-blue-500" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        {recording.title}
                      </h3>

                      <p className="text-sm text-gray-400">
                        {recording.status}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />

                    {new Date(
                      recording.createdAt
                    ).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock className="w-4 h-4" />

                    {recording.duration
                      ? `${Math.floor(recording.duration / 60)} min`
                      : "Unknown duration"}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/recordings/${recording._id}`)
                    }
                    className="
                      flex-1
                      flex
                      items-center
                      justify-center
                      gap-2
                      px-4
                      py-2
                      rounded-xl
                      bg-blue-600
                      hover:bg-blue-700
                      transition
                    "
                  >
                    <Eye className="w-4 h-4" />

                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </Layout>
  )
}