import { Bell, Search, Menu } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import { useState } from "react"
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import notificationService from "../../services/notificationService"

interface TopbarProps {
  title: string
  subtitle?: string
  setMobileOpen?: any
}

export default function Topbar({
  title,
  subtitle,
  setMobileOpen
}: TopbarProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [notificationOpen, setNotificationOpen] =
    useState(false)

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getNotifications,
  })

  const markAsReadMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      })
    },
  })

  const markAllMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      })
    },
  })

  const clearMutation = useMutation({
    mutationFn: notificationService.clearNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      })
    },
  })

  return (
    <header
      className="
      sticky
      top-0
      z-30
      h-16
      border-b
      border-gray-800
      bg-[#0b0f19]/80
      backdrop-blur-md
      flex
      items-center
      justify-between
      px-4
      md:px-6
    "
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-800"
          aria-label="Open Sidebar"
          onClick={() => setMobileOpen?.(true)
            
          }
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-white">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div
          className="
          hidden
          md:flex
          items-center
          gap-2
          bg-gray-900
          border
          border-gray-800
          rounded-xl
          px-3
          py-2
          w-72
        "
        >
          <Search className="w-4 h-4 text-gray-500" />

          <input
            placeholder="Search meetings, users..."
            className="
            bg-transparent
            outline-none
            text-sm
            text-white
            flex-1
          "
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() =>
              setNotificationOpen(!notificationOpen)
            }
            className="
            relative
            p-2
            text-gray-400
            hover:text-white
            hover:bg-gray-800
            rounded-xl
          "
          >
            <Bell className="w-5 h-5" />

            <span
              className="
              absolute
              -top-1
              -right-1
              w-5
              h-5
              bg-blue-600
              text-[10px]
              rounded-full
              flex
              items-center
              justify-center
              text-white
            "
            >
              {notifications.filter((n: any) => !n.isRead).length}
            </span>
          </button>

          {notificationOpen && (
            <div
              className="
              absolute
              right-0
              top-12
              w-80
              bg-gray-900
              border
              border-gray-800
              rounded-xl
              overflow-hidden
              shadow-xl
            "
            >
              <div className="flex items-center justify-between p-3 border-b border-gray-800">

                <p className="font-medium text-white">
                  Notifications
                </p>

                <div className="flex gap-3">

                  {notifications.some((n: any) => !n.isRead) && (
                    <button
                      onClick={() => markAllMutation.mutate()}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Mark all
                    </button>
                  )}

                  {notifications.length > 0 && (
                    <button
                      onClick={() => clearMutation.mutate()}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Clear
                    </button>
                  )}

                </div>

              </div>

              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No notifications
                </div>
              ) : (
                notifications.map((notification: any) => (
                  <div
                    key={notification._id}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsReadMutation.mutate(notification._id)
                      }
                    }}
                    className={`
    p-3
    border-b
    border-gray-800
    cursor-pointer
    hover:bg-gray-800
    ${notification.isRead
                        ? "opacity-60"
                        : "bg-blue-500/10"
                      }
  `}
                  >
                    <p className="text-white text-sm font-medium">
                      {notification.title}
                    </p>

                    <p className="text-gray-400 text-xs mt-1">
                      {notification.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* User */}
        <div
          className="
          flex
          items-center
          gap-3
          bg-gray-900
          border
          border-gray-800
          rounded-xl
          px-3
          py-2
        "
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
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
    </header>
  )
}