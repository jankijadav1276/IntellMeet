import { useEffect, useState } from "react"

export default function MeetingTimer() {

  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const hrs = String(
    Math.floor(seconds / 3600)
  ).padStart(2, "0")

  const mins = String(
    Math.floor((seconds % 3600) / 60)
  ).padStart(2, "0")

  const secs = String(
    seconds % 60
  ).padStart(2, "0")

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
      <p className="text-gray-400 text-xs">
        Meeting Duration
      </p>

      <p className="text-white font-semibold">
        {hrs}:{mins}:{secs}
      </p>
    </div>
  )
}
