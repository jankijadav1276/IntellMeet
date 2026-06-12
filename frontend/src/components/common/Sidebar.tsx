import {
  Video,
  Users,
  BarChart2,
  LayoutDashboard,
  LogOut
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Meetings", icon: Video, path: "/meetings" },
  { label: "Team", icon: Users, path: "/team" },
  { label: "Analytics", icon: BarChart2, path: "/analytics" },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, handleLogout } = useAuth()

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="flex items-center gap-3 px-5 h-20 border-b border-gray-800">
        <div className="bg-blue-600 p-2 rounded-xl">
          <Video className="w-5 h-5 text-white" />
        </div>

        <div>
          <h1 className="text-white font-semibold text-lg">
            IntellMeet
          </h1>
          <p className="text-xs text-gray-400">
            Collaboration Platform
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-2">
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path

          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-gray-800 p-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50 mb-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium shrink-0">
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
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}