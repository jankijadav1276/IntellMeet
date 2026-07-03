import {
  Video,
  Users,
  BarChart2,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User,
  Settings
} from "lucide-react"
import { FileText } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useState } from "react"

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard"
  },
  {
    label: "Meetings",
    icon: Video,
    path: "/meetings"
  },
  {
  label: "Meeting History",
  icon: FileText,
  path: "/meetings/history"
},
  {
    label: "Team",
    icon: Users,
    path: "/team"
  },
  {
    label: "Analytics",
    icon: BarChart2,
    path: "/analytics"
  }
]

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}: any) {

  const navigate = useNavigate()
  const location = useLocation()
  const { user, handleLogout } = useAuth()

  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
        fixed md:static z-50 h-screen bg-[#111827]
        border-r border-gray-800 flex flex-col
        transition-all duration-300 ease-in-out

        ${mobileOpen ? "left-0" : "-left-full md:left-0"}
        ${collapsed ? "md:w-20" : "md:w-60"}
        w-60
        `}
      >

        <div className="p-4 border-b border-gray-800 flex items-center justify-between">

          {!collapsed && (
            <div>
              <h1 className="text-lg font-semibold text-white">
                IntellMeet
              </h1>

              <p className="text-xs text-gray-400">
                Collaboration Platform
              </p>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block p-2 rounded-lg hover:bg-gray-800 transition"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>


          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-800"
            onClick={() => setMobileOpen(false)}
          >
            ✕
          </button>

        </div>


        <nav className="flex-1 px-2 py-5 space-y-2">

          {navItems.map(({label,icon:Icon,path})=>{

            const isActive = location.pathname === path

            return (

              <button
                key={label}
                onClick={()=>{
                  navigate(path)
                  setMobileOpen(false)
                }}

                className={`
                group
                relative
                w-full
                flex
                items-center
                gap-3
                px-3
                py-3
                rounded-xl
                text-sm
                transition-all

                ${
                  isActive
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }
                `}
              >

                {
                  isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-blue-500"/>
                  )
                }


                <Icon className="w-5 h-5"/>


                {!collapsed && label}


              </button>

            )

          })}

        </nav>



        <div className="border-t border-gray-800 p-3">


          <div className="relative">


            <button
              onClick={()=>setProfileOpen(!profileOpen)}
              className="w-full flex items-center justify-between gap-3"
            >

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white">

                  {
                    user?.name?.charAt(0).toUpperCase() ?? "U"
                  }

                </div>


                {!collapsed && (

                  <div className="text-left">

                    <p className="text-sm text-white">
                      {user?.name ?? "User"}
                    </p>

                    <p className="text-xs text-gray-400">
                      {user?.email ?? ""}
                    </p>

                  </div>

                )}

              </div>



              {!collapsed && (

                <ChevronDown
                  className={`
                  w-4 h-4 transition
                  ${profileOpen ? "rotate-180":""}
                  `}
                />

              )}

            </button>




            {
              profileOpen && !collapsed && (

                <div
                  className="
                  absolute
                  bottom-14
                  left-0
                  w-full
                  bg-gray-900
                  border
                  border-gray-800
                  rounded-xl
                  overflow-hidden
                  shadow-xl
                  "
                >


                  <button

                    onClick={()=>navigate("/profile")}

                    className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    hover:bg-gray-800
                    "

                  >

                    <User className="w-4 h-4"/>

                    Profile

                  </button>



                  <button

                    onClick={()=>navigate("/settings")}

                    className="
                    w-full
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    hover:bg-gray-800
                    "

                  >

                    <Settings className="w-4 h-4"/>

                    Settings

                  </button>


                </div>

              )
            }



          </div>



          <button

            onClick={handleLogout}

            className="
            mt-3
            w-full
            flex
            items-center
            gap-3
            px-3
            py-3
            rounded-xl
            text-sm
            text-gray-400
            hover:bg-gray-800
            hover:text-white
            "

          >

            <LogOut className="w-5 h-5"/>

            {!collapsed && "Logout"}

          </button>


        </div>


      </aside>

    </>
  )
}