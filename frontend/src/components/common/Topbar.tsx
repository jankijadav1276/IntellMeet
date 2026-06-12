import { Bell, Search } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"

interface TopbarProps {
  title: string
  subtitle?: string
}

export default function Topbar({
  title,
  subtitle,
}: TopbarProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-20 bg-gray-950/80 backdrop-blur border-b border-gray-800">
      <div className="h-20 px-8 max-w-[1600px] mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 w-72">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm text-white placeholder-gray-500 flex-1"
            />
          </div>

          <button className="relative text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full" />
          </button>

          <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>

            <div className="hidden md:block">
              <p className="text-sm text-white font-medium">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs text-gray-400">
                {user?.email ?? ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}