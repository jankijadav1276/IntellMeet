import { Routes, Route, Navigate } from "react-router-dom"

import LoginPage from "../pages/auth/LoginPage"
import SignupPage from "../pages/auth/SignUpPage"

import DashboardPage from "../pages/dashboard/DashboardPage"

import MeetingsPage from "../pages/meetings/MeetingsPage"
import CreateMeetingPage from "../pages/meetings/CreateMeetingPage"
import JoinMeetingPage from "../pages/meetings/JoinMeetingPage"
import MeetingLobbyPage from "../pages/meetings/MeetingLobbyPage"
import MeetingRoomPage from "../pages/meetings/MeetingRoomPage"
import MeetingHistoryPage from "../pages/meetings/MeetingHistoryPage"
import MeetingSummaryPage from "../pages/meetings/MeetingSummaryPage"

import TeamPage from "../pages/team/TeamPage"
import AnalyticsPage from "../pages/analytics/AnalyticsPage"

import SettingsPage from "../pages/settings/SettingsPage"
import WorkspaceSettings from "../pages/settings/WorkspaceSettings"
import MeetingSettings from "../pages/settings/MeetingSettings"
import AudioVideoSettings from "../pages/settings/AudioVideoSettings"
import NotificationSettings from "../pages/settings/NotificationSettings"
import AppearanceSettings from "../pages/settings/AppearanceSettings"
import SecuritySettings from "../pages/settings/SecuritySettings"

import ProfilePage from "../pages/profile/ProfilePage"
import ProfileOverview from "../pages/profile/ProfileOverview"
import About from "../pages/profile/About"
import EditProfile from "../pages/profile/EditProfilePage"
import ChangePassword from "../pages/profile/ChangePasswordPage"
import ManageSessions from "../pages/profile/ManageSessions"
import DeleteAccount from "../pages/profile/DeleteAccount"
import HelpSupport from "../pages/profile/HelpSupport"
import PrivacyPolicy from "../pages/profile/PrivacyPolicy"
import PrivacySecurity from "../pages/profile/PrivacySecurity"
import TermsConditions from "../pages/profile/TermsConditions"
import RecordingsPage from "../pages/recording/RecordingsPage"
import RecordingDetailsPage from "../pages/recording/RecordingDetailsPage"
import PrivateRoute from "./PrivateRoute"
import PublicRoute from "./PublicRoute"

export default function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

      {/* ROOT */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* DASHBOARD */}
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />

      {/* MEETINGS */}
      <Route path="/meetings" element={<PrivateRoute><MeetingsPage /></PrivateRoute>} />
      <Route path="/meetings/create" element={<PrivateRoute><CreateMeetingPage /></PrivateRoute>} />
      <Route path="/meetings/join" element={<PrivateRoute><JoinMeetingPage /></PrivateRoute>} />
      <Route path="/meetings/history" element={<PrivateRoute><MeetingHistoryPage /></PrivateRoute>} />

      <Route path="/meetings/:id/lobby" element={<PrivateRoute><MeetingLobbyPage /></PrivateRoute>} />
      <Route path="/meetings/:id" element={<PrivateRoute><MeetingRoomPage /></PrivateRoute>} />
      <Route path="/meetings/:id/summary" element={<PrivateRoute><MeetingSummaryPage /></PrivateRoute>} />

      {/* RECORDINGS */}
      <Route path="/recordings" element={<PrivateRoute><RecordingsPage /></PrivateRoute>} />
      <Route path="/recordings/:id" element={<PrivateRoute><RecordingDetailsPage /></PrivateRoute>} />

      {/* TEAM & ANALYTICS */}
      <Route path="/team" element={<PrivateRoute><TeamPage /></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />

      {/* SETTINGS (nested routes) */}
      <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>}>
        <Route index element={<WorkspaceSettings />} />
        <Route path="workspace" element={<WorkspaceSettings />} />
        <Route path="meeting" element={<MeetingSettings />} />
        <Route path="audio-video" element={<AudioVideoSettings />} />
        <Route path="notifications" element={<NotificationSettings />} />
        <Route path="appearance" element={<AppearanceSettings />} />
        <Route path="security" element={<SecuritySettings />} />
      </Route>

      {/* PROFILE (nested routes) */}
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>}>
        <Route index element={<ProfileOverview />} />
        <Route path="about" element={<About />} />
        <Route path="edit" element={<EditProfile />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="sessions" element={<ManageSessions />} />
        <Route path="delete-account" element={<DeleteAccount />} />
        <Route path="help" element={<HelpSupport />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="privacy-security" element={<PrivacySecurity />} />
        <Route path="terms" element={<TermsConditions />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />

    </Routes>
  )
}