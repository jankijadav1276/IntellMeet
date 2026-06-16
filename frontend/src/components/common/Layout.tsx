import { useState } from "react"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

interface LayoutProps {
title: string
subtitle?: string
children: React.ReactNode
}

export default function Layout({
title,
subtitle,
children,
}: LayoutProps) {

const [collapsed,setCollapsed]=useState(false)
const [mobileOpen,setMobileOpen]=useState(false)

return(
<div className="flex min-h-screen bg-[#0b0f19] text-white">

{/* Sidebar (desktop + mobile) */}
<Sidebar
collapsed={collapsed}
setCollapsed={setCollapsed}
mobileOpen={mobileOpen}
setMobileOpen={setMobileOpen}
/>

{/* Main */}
<div className="flex-1 flex flex-col">

<Topbar
title={title}
subtitle={subtitle}
setMobileOpen={setMobileOpen}
/>

<main className="flex-1 px-6 md:px-8 py-6 max-w-[1600px] mx-auto w-full">
{children}
</main>

</div>

</div>
)
}