import {
Video,
Users,
Clock3,
CalendarDays,
Mail,
ShieldCheck,
Edit3
} from "lucide-react"
import {useNavigate} from "react-router-dom"
import useAuthStore from "../../store/authStore"

export default function ProfileOverview(){

const {user}=useAuthStore()
const navigate=useNavigate()

return(

<div className="space-y-6">


{/* Profile Header */}

<div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-2xl p-6">

<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">


<div className="flex items-center gap-5">


{
user?.avatar ?

<img
src={user.avatar}
className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
/>

:

<div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold">

{user?.name?.charAt(0).toUpperCase() || "U"}

</div>

}



<div>

<h1 className="text-2xl font-bold">
{user?.name || "IntellMeet User"}
</h1>


<p className="text-gray-400 flex items-center gap-2 mt-2">

<Mail size={16}/>

{user?.email}

</p>


<div className="flex items-center gap-2 mt-3">

<span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">

Active

</span>


<span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">

{user?.role || "Member"}

</span>

</div>


</div>


</div>



<button
onClick={()=>navigate("edit")}
className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl"
>

<Edit3 size={18}/>

Edit Profile

</button>



</div>


</div>




{/* Meeting Overview */}

<div>

<h2 className="text-xl font-semibold mb-4">
Meeting Overview
</h2>


<div className="grid md:grid-cols-3 gap-4">



<div className="bg-[#181818] border border-white/10 rounded-xl p-5">

<Video className="text-blue-500"/>

<p className="text-gray-400 mt-4">
Meetings Created
</p>

<h3 className="text-3xl font-bold mt-1">
0
</h3>


</div>



<div className="bg-[#181818] border border-white/10 rounded-xl p-5">

<Users className="text-purple-500"/>

<p className="text-gray-400 mt-4">
Meetings Joined
</p>


<h3 className="text-3xl font-bold mt-1">
0
</h3>


</div>




<div className="bg-[#181818] border border-white/10 rounded-xl p-5">

<Clock3 className="text-green-500"/>

<p className="text-gray-400 mt-4">
Total Meeting Time
</p>


<h3 className="text-3xl font-bold mt-1">
0h
</h3>


</div>



</div>


</div>





{/* Account Details */}


<div className="bg-[#181818] border border-white/10 rounded-2xl p-6">


<h2 className="text-xl font-semibold mb-5">
Account Details
</h2>



<div className="space-y-4">


<div className="flex justify-between">

<span className="text-gray-400">
Account ID
</span>

<span>
{user?.id || "Not available"}
</span>

</div>



<div className="flex justify-between">

<span className="text-gray-400">
Security
</span>

<span className="flex items-center gap-2 text-green-400">

<ShieldCheck size={16}/>

Protected

</span>

</div>



<div className="flex justify-between">

<span className="text-gray-400">
Joined

</span>

<span className="flex items-center gap-2">

<CalendarDays size={16}/>

Recently

</span>


</div>


</div>


</div>


</div>

)

}