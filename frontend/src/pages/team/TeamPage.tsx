import { Search, Plus, Users, UserCheck, Building2 } from "lucide-react"
import Layout from "../../components/common/Layout"

const teamStats = [
  {
    label: "Total Members",
    value: "12",
    icon: Users,
  },
  {
    label: "Online",
    value: "8",
    icon: UserCheck,
  },
  {
    label: "Departments",
    value: "3",
    icon: Building2,
  },
]

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Project Manager",
    status: "Online",
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@example.com",
    role: "Frontend Developer",
    status: "Online",
  },
  {
    id: 3,
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Backend Developer",
    status: "Offline",
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "UI/UX Designer",
    status: "Online",
  },
]

export default function TeamPage() {
  return (
    <Layout
      title="Team"
      subtitle="Manage your team members"
    >
      <div className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamStats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-sm">{label}</p>

                <div className="bg-gray-800 p-2 rounded-lg">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
              </div>

              <p className="text-white text-2xl font-semibold">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 w-full md:max-w-md">
            <Search className="w-4 h-4 text-gray-500" />

            <input
              type="text"
              placeholder="Search team members..."
              className="bg-transparent outline-none text-white flex-1"
            />
          </div>

          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl transition">
            <Plus className="w-4 h-4" />
            Invite Member
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-medium">
                    {member.name}
                  </h3>

                  <p className="text-gray-400 text-sm">
                    {member.email}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    member.status === "Online"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {member.status}
                </span>
              </div>

              <p className="text-blue-400 text-sm">
                {member.role}
              </p>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  )
}