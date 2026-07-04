import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function BackToDashboard() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate("/dashboard")}
      className="
        inline-flex items-center gap-2
        text-blue-400
        hover:text-blue-300
        hover:underline
        transition
        mb-6
      "
    >
      <ArrowLeft size={18} />
      Back to Dashboard
    </button>
  )
}