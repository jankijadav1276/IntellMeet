import {
Video,
Users,
BarChart2,
LayoutDashboard,
LogOut,
ChevronLeft,
ChevronRight
} from "lucide-react"

import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

const navItems=[
{label:"Dashboard",icon:LayoutDashboard,path:"/dashboard"},
{label:"Meetings",icon:Video,path:"/meetings"},
{label:"Team",icon:Users,path:"/team"},
{label:"Analytics",icon:BarChart2,path:"/analytics"}
]

export default function Sidebar({
collapsed,
setCollapsed,
mobileOpen,
setMobileOpen
}:any){

const navigate=useNavigate()
const location=useLocation()
const {user,handleLogout}=useAuth()

return(
<>

{/* Overlay (mobile only) */}
{mobileOpen && (
<div
className="fixed inset-0 bg-black/60 z-40 md:hidden"
onClick={()=>setMobileOpen(false)}
/>
)}

<aside className={`
fixed md:static z-50 h-screen bg-[#111827] border-r border-gray-800 flex flex-col
transition-all duration-300 ease-in-out

${mobileOpen ? "left-0" : "-left-full md:left-0"}
${collapsed ? "md:w-20" : "md:w-60"}
w-60
`}>

{/* Header */}
<div className="p-4 border-b border-gray-800 flex items-center justify-between">

{!collapsed && (
<div>
<h1 className="text-lg font-semibold">IntellMeet</h1>
<p className="text-xs text-gray-400">Collaboration Platform</p>
</div>
)}

<button
onClick={()=>setCollapsed(!collapsed)}
className="hidden md:block p-2 rounded-lg hover:bg-gray-800 transition"
>
{collapsed
? <ChevronRight className="w-4 h-4"/>
: <ChevronLeft className="w-4 h-4"/>
}
</button>

{/* Mobile close */}
<button
className="md:hidden p-2 rounded-lg hover:bg-gray-800"
onClick={()=>setMobileOpen(false)}
>
✕
</button>

</div>

{/* Nav */}
<nav className="flex-1 px-2 py-5 space-y-2">

{navItems.map(({label,icon:Icon,path})=>{
const isActive=location.pathname===path

return(
<button
key={label}
onClick={()=>{
navigate(path)
setMobileOpen(false)
}}
className={`group relative w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all duration-200 ${
isActive
? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
: "text-gray-400 hover:bg-gray-800 hover:text-white"
}`}
>

<Icon className="w-5 h-5 group-hover:scale-110 transition"/>

{!collapsed && label}

{collapsed && (
<span className="absolute left-16 bg-black text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100">
{label}
</span>
)}

</button>
)
})}

</nav>

{/* User */}
<div className="border-t border-gray-800 p-3">

<div className="flex items-center gap-3 mb-3">

<div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white">
{user?.name?.charAt(0).toUpperCase() ?? "U"}
</div>

{!collapsed && (
<div>
<p className="text-sm text-white">
{user?.name ?? "User"}
</p>
<p className="text-xs text-gray-400">
{user?.email ?? ""}
</p>
</div>
)}

</div>

<button
onClick={handleLogout}
className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white"
>
<LogOut className="w-5 h-5"/>
{!collapsed && "Logout"}
</button>

</div>

</aside>

</>
)
}