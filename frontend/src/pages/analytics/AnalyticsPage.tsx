import { useEffect} from "react"

import Layout from "../../components/common/Layout"

import {
  Video,
  Clock,
  Users,
  FileText,

} from "lucide-react"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

import {
  Doughnut
} from "react-chartjs-2"

import {
  Chart,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js"

Chart.register(
  ArcElement,
  ChartTooltip,
  Legend
)

import { getAnalytics } from "../../services/analyticsService"
import useAnalyticsStore from "../../store/analyticsStore"




export default function AnalyticsPage() {

  const { analytics, setAnalytics } = useAnalyticsStore()

useEffect(() => {

  
  const fetchAnalytics = async () => {
    try {
      const data = await getAnalytics()
      setAnalytics(data)
    } catch (err) {
      console.error(err)
    }
  }

  fetchAnalytics()
}, [setAnalytics])

const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
};

const stats = [
  {
    label: "Total Meetings",
    value: analytics?.totalMeetings ?? 0,
    icon: Video,
    color: "text-blue-400",
  },
  {
    label: "Meeting Time",
    value: (() => {
      const minutes = analytics?.totalMeetingMinutes ?? 0;

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (mins === 0) {
      return `${hrs} hr`;
    }

    return `${hrs} hr ${mins} min`;
  })(),
    icon: Clock,
    color: "text-green-400",
  },
  {
    label: "Participants",
    value: analytics?.totalParticipants ?? 0,
    icon: Users,
    color: "text-purple-400",
  },
  {
    label: "AI Summaries",
    value: analytics?.aiSummaries ?? 0,
    icon: FileText,
    color: "text-orange-400",
  },
]


const meetingData = analytics?.weeklyMeetings ?? [];
const monthlyData =
  analytics?.monthlyMeetings ?? [];
const meetingStatusData = {
  labels: [
    "Active",
    "Scheduled",
    "Completed",
  ],

  datasets: [
    {
      data: [
        analytics?.activeMeetings ?? 0,
        analytics?.scheduledMeetings ?? 0,
        analytics?.completedMeetings ?? 0,
      ],

      backgroundColor: [
        "#22C55E",
        "#3B82F6",
        "#A855F7",
      ],

      borderWidth: 0,
    },
  ],
};



  return (
    <Layout
      title="Analytics"
      subtitle="Meeting insights and performance"
    >
      <div className="space-y-6">


        

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="
                  bg-gradient-to-br
                  from-gray-900
                  to-gray-950
                  border
                  border-gray-800
                  rounded-2xl
                  p-6
                  shadow-lg
                  hover:border-blue-500
                  hover:-translate-y-1
                  transition-all
                  duration-300
                  "
            >

              
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-sm">
                  {label}
                </p>

                <div className="bg-gray-800 p-3 rounded-xl">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
              </div>

              <p className="text-3xl font-bold text-white mt-4">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

  <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
    <p className="text-sm text-gray-400">
      Active Meetings
    </p>

    <h2 className="text-4xl font-bold text-green-400 mt-3">
      {analytics?.activeMeetings ?? 0}
    </h2>
  </div>

  <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
    <p className="text-sm text-gray-400">
      Scheduled Meetings
    </p>

    <h2 className="text-4xl font-bold text-blue-400 mt-3">
      {analytics?.scheduledMeetings ?? 0}
    </h2>
  </div>

  <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5">
    <p className="text-sm text-gray-400">
      Completed Meetings
    </p>

    <h2 className="text-4xl font-bold text-purple-400 mt-3">
      {analytics?.completedMeetings ?? 0}
    </h2>
  </div>

</div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

  {/* Weekly Meeting Activity */}
  <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">

    <h2 className="text-white font-semibold mb-6">
      Weekly Meeting Activity
    </h2>

    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={meetingData}>
          <CartesianGrid
            stroke="#374151"
            strokeDasharray="4 4"
          />

          <XAxis
            dataKey="day"
            tick={{ fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "#111827",
              border: "1px solid #374151",
              borderRadius: "12px",
            }}
          />

          <Line
            type="monotone"
            dataKey="meetings"
            stroke="#3B82F6"
            strokeWidth={4}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>

  </div>

  {/* Meeting Status */}
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">

    <h2 className="text-white font-semibold mb-6">
      Meeting Status
    </h2>

    <div className="h-80 flex items-center justify-center">
      <Doughnut
        data={meetingStatusData}
        options={{
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#9CA3AF",
              },
            },
          },
          cutout: "70%",
        }}
      />
    </div>

  </div>

</div>
<div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

  <div className="flex items-center justify-between mb-6">

    <div>
      <h2 className="text-white font-semibold">
        Monthly Meeting Activity
      </h2>

      <p className="text-sm text-gray-400 mt-1">
        Meetings created each month
      </p>
    </div>

    <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
      <span className="text-xs text-blue-400 font-medium">
        Last 12 Months
      </span>
    </div>

  </div>

  <div className="h-80">

    <ResponsiveContainer width="100%" height="100%">
  <BarChart
    data={monthlyData}
    layout="vertical"
    margin={{
      top: 10,
      right: 30,
      left: 20,
      bottom: 10,
    }}
  >
    <CartesianGrid
      stroke="#374151"
      strokeDasharray="4 4"
      horizontal={false}
    />

    <XAxis
      type="number"
      tick={{ fill: "#9CA3AF" }}
      axisLine={false}
      tickLine={false}
    />

    <YAxis
      type="category"
      dataKey="month"
      tick={{ fill: "#9CA3AF" }}
      axisLine={false}
      tickLine={false}
      width={50}
    />

    <Tooltip
      cursor={{ fill: "rgba(59,130,246,0.08)" }}
      contentStyle={{
        background: "#111827",
        border: "1px solid #374151",
        borderRadius: "12px",
      }}
    />

    <Bar
      dataKey="meetings"
      fill="#3B82F6"
      radius={[0, 8, 8, 0]}
      barSize={18}
    />
  </BarChart>
</ResponsiveContainer>

  </div>

</div>

</div>
    </Layout>
  )
}