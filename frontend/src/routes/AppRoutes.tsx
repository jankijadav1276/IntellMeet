import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "../pages/auth/LoginPage"
import SignupPage from "../pages/auth/SignUpPage"
import DashboardPage from "../pages/dashboard/DashboardPage"
import MeetingsPage from "../pages/meetings/MeetingsPage"
import MeetingRoomPage from "../pages/meetings/MeetingRoomPage"
import MeetingSummaryPage from "../pages/meetings/MeetingSummaryPage"
import TeamPage from "../pages/team/TeamPage"
import AnalyticsPage from "../pages/analytics/AnalyticsPage"
import PrivateRoute from "./PrivateRoute"
import JoinMeetingPage from "../pages/meetings/JoinMeetingPage"

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      {/* Meetings List */}
      <Route
        path="/meetings"
        element={
          <PrivateRoute>
            <MeetingsPage />
          </PrivateRoute>
        }
      />

      {/* Meeting Room */}
      <Route
        path="/meetings/:id"
        element={
          <PrivateRoute>
            <MeetingRoomPage />
          </PrivateRoute>
        }
      />

      {/* Meeting Summary */}
      <Route
        path="/meetings/:id/summary"
        element={
          <PrivateRoute>
            <MeetingSummaryPage />
          </PrivateRoute>
        }
      />

      {/* Team */}
      <Route
        path="/team"
        element={
          <PrivateRoute>
            <TeamPage />
          </PrivateRoute>
        }
      />

      {/* Analytics */}
      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <AnalyticsPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/join"
        element={
          <PrivateRoute>
            <JoinMeetingPage />
          </PrivateRoute>
        }
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      {/* Default */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}