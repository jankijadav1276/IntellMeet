import { Bell, Search, Menu } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"

interface TopbarProps {
title: string
subtitle?: string
setMobileOpen?: any
}

export default function Topbar({
title,
subtitle,
setMobileOpen
}:TopbarProps){

const {user}=useAuth()

return(
<header className="h-16 border-b border-gray-800 bg-[#0b0f19]/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6">

{/* Left */}
<div className="flex items-center gap-3">

{/* Mobile menu */}
<button
className="md:hidden p-2 rounded-lg hover:bg-gray-800"
onClick={()=>setMobileOpen?.(true)}
>
<Menu className="w-5 h-5"/>
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
<div className="hidden md:flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 w-72">
<Search className="w-4 h-4 text-gray-500"/>
<input
placeholder="Search..."
className="bg-transparent outline-none text-sm text-white flex-1"
/>
</div>

{/* Bell */}
<button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl">
<Bell className="w-5 h-5"/>
<span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"/>
</button>

{/* User */}
<div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2">

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