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
  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />

      <main className="ml-60 min-h-screen">
        <Topbar title={title} subtitle={subtitle} />

        <div className="px-8 py-6 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}