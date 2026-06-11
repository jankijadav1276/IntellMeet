import { Video, Users, Calendar, BarChart2, LogOut } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

// Define nav items in one place
const navItems = [
  { label: "Dashboard", icon: BarChart2, path: "/dashboard" },
  { label: "Meetings", icon: Video, path: "/meetings" },
  { label: "Calendar", icon: Calendar, path: "/calendar" },
  { label: "Team", icon: Users, path: "/team" },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()  // tells you current URL path
  const { user, handleLogout } = useAuth()

  return (
    <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full z-20">

      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-800">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Video className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-semibold text-lg">IntellMeet</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, icon: Icon, path }) => {
          // Check if this nav item matches current page
          const isActive = location.pathname === path

          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          )
        })}
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-gray-800 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.name ?? "User"}
            </p>
            <p className="text-gray-400 text-xs truncate">
              {user?.email ?? ""}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

    </aside>
  )
}