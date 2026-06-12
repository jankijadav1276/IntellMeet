import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "../pages/auth/LoginPage"
import SignupPage from "../pages/auth/SignUpPage"
import DashboardPage from "../pages/dashboard/DashboardPage"
import MeetingsPage from "../pages/meetings/MeetingsPage"
import MeetingRoomPage from "../pages/meetings/MeetingRoomPage"
import PrivateRoute from "./PrivateRoute"
import MeetingSummaryPage from "../pages/meetings/MeetingSummaryPage"
import TeamPage from "../pages/team/TeamPage"
import AnalyticsPage from "../pages/analytics/AnalyticsPage"

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"  element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/meetings" element={<PrivateRoute><MeetingsPage /></PrivateRoute>} />
      <Route path="/meeting/:id" element={<PrivateRoute><MeetingRoomPage /></PrivateRoute>} />

      {/* Stubs — will be built next */}
    <Route path="/team" element={<PrivateRoute><TeamPage /></PrivateRoute>}/>
      <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
      <Route path="/profile"   element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/meetings/:id/summary" element={<PrivateRoute><MeetingSummaryPage /></PrivateRoute>} />
     <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}