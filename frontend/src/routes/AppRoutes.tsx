import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "../pages/auth/LoginPage"
import SignupPage from "../pages/auth/SignUpPage"
import DashboardPage from "../pages/dashboard/DashboardPage"
import MeetingRoomPage from "../pages/meetings/MeetingRoomPage"


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/meeting/:id"element={<MeetingRoomPage />}/>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}