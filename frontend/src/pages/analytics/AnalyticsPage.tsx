import Layout from "../../components/common/Layout"
import {
  Video,
  Clock,
  Users,
  FileText
} from "lucide-react"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

const stats = [
  {
    label: "Total Meetings",
    value: "48",
    icon: Video,
  },
  {
    label: "Meeting Hours",
    value: "126",
    icon: Clock,
  },
  {
    label: "Attendance Rate",
    value: "92%",
    icon: Users,
  },
  {
    label: "AI Summaries",
    value: "31",
    icon: FileText,
  },
]

const meetingData = [
  { day: "Mon", meetings: 4 },
  { day: "Tue", meetings: 7 },
  { day: "Wed", meetings: 5 },
  { day: "Thu", meetings: 8 },
  { day: "Fri", meetings: 6 },
  { day: "Sat", meetings: 2 },
  { day: "Sun", meetings: 1 },
]

export default function AnalyticsPage() {
  return (
    <Layout
      title="Analytics"
      subtitle="Meeting insights and performance"
    >
      <div className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-sm">
                  {label}
                </p>

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

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-6">
            Weekly Meeting Activity
          </h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={meetingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="meetings"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </Layout>
  )
}