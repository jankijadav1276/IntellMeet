import {Routes,Route} from "react-router-dom"

import Dashboard from "../pages/dashboard/DashboardPage"
import Meetings from "../pages/meetings/MeetingsPage"
import MeetingRoom from "../pages/meetings/MeetingRoomPage"

import ProfilePage from "../pages/profile/ProfilePage"
import About from "../pages/profile/About"
import EditProfile from "../pages/profile/EditProfilePage"
import ChangePassword from "../pages/profile/ChangePasswordPage"
import ManageSessions from "../pages/profile/ManageSessions"
import DeleteAccount from "../pages/profile/DeleteAccount"
import HelpSupport from "../pages/profile/HelpSupport"
import PrivacyPolicy from "../pages/profile/PrivacyPolicy"
import PrivacySecurity from "../pages/profile/PrivacySecurity"
import TermsConditions from "../pages/profile/TermsConditions"
import ProfileOverview from "../pages/profile/ProfileOverview"

export default function AppRoutes(){

return(

<Routes>

<Route path="/" element={<Dashboard/>}/>

<Route path="/dashboard" element={<Dashboard/>}/>

<Route path="/meetings" element={<Meetings/>}/>

<Route path="/meeting/:id" element={<MeetingRoom/>}/>


<Route path="/profile" element={<ProfilePage/>}>

<Route index element={<ProfileOverview/>}/>

<Route path="about" element={<About/>}/>

<Route path="edit" element={<EditProfile/>}/>

<Route path="change-password" element={<ChangePassword/>}/>

<Route path="sessions" element={<ManageSessions/>}/>

<Route path="delete-account" element={<DeleteAccount/>}/>

<Route path="help" element={<HelpSupport/>}/>

<Route path="privacy-policy" element={<PrivacyPolicy/>}/>

<Route path="privacy-security" element={<PrivacySecurity/>}/>

<Route path="terms" element={<TermsConditions/>}/>

</Route>


</Routes>

)

}