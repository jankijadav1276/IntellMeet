import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Video } from "lucide-react"

export default function JoinMeetingPage() {
  const [code, setCode] = useState("")
  const navigate = useNavigate()

  function handleJoin() {
    if (!code.trim()) return
    navigate(`/meeting/${code}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-6 rounded-xl">

        <div className="flex items-center gap-2 mb-4">
          <Video className="w-5 h-5 text-blue-400" />
          <h1 className="text-xl font-semibold">Join Meeting</h1>
        </div>

        {/* CODE INPUT */}
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter meeting code"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg mb-3"
        />

        <button
          onClick={handleJoin}
          className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg"
        >
          Join
        </button>

        <p className="text-gray-500 text-sm mt-4">
          Or paste meeting link below
        </p>

        <input
          placeholder="https://app.com/meeting/123"
          className="w-full p-3 mt-2 bg-gray-800 border border-gray-700 rounded-lg"
          onBlur={(e) => {
            const match = e.target.value.match(/meeting\/(.+)/)
            if (match?.[1]) {
              navigate(`/meeting/${match[1]}`)
            }
          }}
        />
      </div>
    </div>
  )
}