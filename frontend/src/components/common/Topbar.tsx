import { Bell } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"

// Props — title and subtitle can be passed in from each page
interface TopbarProps {
  title: string
  subtitle?: string  // optional
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { user } = useAuth()

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-white font-semibold text-lg">{title}</h1>
        {subtitle && (
          <p className="text-gray-400 text-xs">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="relative text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user?.name?.charAt(0).toUpperCase() ?? "U"}
        </div>
      </div>
    </header>
  )
}