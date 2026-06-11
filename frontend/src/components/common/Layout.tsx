import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

// Props — every page passes its title and content
interface LayoutProps {
  title: string
  subtitle?: string
  children: React.ReactNode  // children = whatever is inside <Layout>...</Layout>
}

export default function Layout({ title, subtitle, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      <Sidebar />
      <main className="flex-1 ml-60">
        <Topbar title={title} subtitle={subtitle} />
        <div className="px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}