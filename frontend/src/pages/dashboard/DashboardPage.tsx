import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {useQuery,useMutation,useQueryClient} from "@tanstack/react-query"
import {Video,Plus,Clock,Users,BarChart2,Loader2,AlertCircle,Calendar,PlayCircle} from "lucide-react"

import meetingService from "../../services/meetingService"
import useMeetingStore from "../../store/meetingStore"
import useAuthStore from "../../store/authStore"
import Layout from "../../components/common/Layout"
import type {Meeting} from "../../types"

const stats=[
{
label:"Meetings this week",
value:"8",
change:"+12%",
icon:Video
},
{
label:"Hours in meetings",
value:"6.5",
change:"+8%",
icon:Clock
},
{
label:"Team members",
value:"12",
change:"+2",
icon:Users
},
{
label:"Action items",
value:"14",
change:"+5",
icon:BarChart2
},
]

const quickActions=[
{title:"New Meeting",description:"Create a meeting instantly",icon:Plus,action:"new"},
{title:"Join Meeting",description:"Enter an existing meeting",icon:PlayCircle,action:"join"},
{title:"Schedule Meeting",description:"Plan a future meeting",icon:Calendar,action:"schedule"},
]

const recentActivities=[
{id:1,title:"Weekly Standup completed",time:"10 minutes ago"},
{id:2,title:"Project Review scheduled",time:"1 hour ago"},
{id:3,title:"Client Discussion created",time:"Today"},
]

export default function DashboardPage(){

const navigate=useNavigate()
const user=useAuthStore((state)=>state.user)

const queryClient=useQueryClient()
const {addMeeting}=useMeetingStore()

const [showModal,setShowModal]=useState(false)
const [newMeeting,setNewMeeting]=useState({title:"",date:"",time:""})
const [formError,setFormError]=useState("")

function handleQuickAction(action:string){
if(action==="new"||action==="schedule") setShowModal(true)
if(action==="join") navigate("/meetings")
}

const {data:meetings=[],isLoading,isError}=useQuery({
queryKey:["meetings"],
queryFn:meetingService.getMeetings
})

const createMutation=useMutation({
mutationFn:meetingService.createMeeting,
onSuccess:(created)=>{
queryClient.setQueryData<Meeting[]>(["meetings"],(old=[])=>[created,...old])
addMeeting(created)
closeModal()
},
onError:()=>{
setFormError("Failed to create meeting. Please try again.")
}
})

function closeModal(){
setShowModal(false)
setNewMeeting({title:"",date:"",time:""})
setFormError("")
}

function handleCreateMeeting(e:React.FormEvent){
e.preventDefault()

if(!newMeeting.title.trim()){
setFormError("Meeting title is required.")
return
}

if(!newMeeting.date||!newMeeting.time){
setFormError("Please pick date and time.")
return
}

createMutation.mutate({
title:newMeeting.title.trim(),
date:newMeeting.date,
time:newMeeting.time
})
}

return(
<Layout
title={`Welcome, ${user?.name||"User"}`}
subtitle={new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
>

{/* Welcome Banner */}

<div className="mb-8 rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-600/20 to-indigo-600/10 p-8">

<h1 className="text-3xl font-bold text-white mb-2">
Good Evening, {user?.name || "User"} 👋
</h1>

<p className="text-gray-300">
You currently have {meetings.length} meetings in your workspace.
</p>

</div>

{/* Stats */}

<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

{stats.map(({label,value,change,icon:Icon})=>(
<div
key={label}
className="
bg-gray-900
border
border-gray-800
rounded-2xl
p-5
hover:border-blue-500/40
transition
"
>

<div className="flex justify-between mb-4">

<div>

<p className="text-gray-400 text-sm">
{label}
</p>

<h2 className="text-white text-3xl font-bold mt-2">
{value}
</h2>

</div>

<div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center">
<Icon className="w-5 h-5 text-blue-400"/>
</div>

</div>

<p className="text-green-400 text-sm">
{change} this month
</p>

</div>
))}

</div>

{/* Quick Actions */}

<div className="mb-8">

<h2 className="text-white text-lg font-semibold mb-4">
Quick Actions
</h2>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

{quickActions.map(({title,description,icon:Icon,action})=>(

<button
key={title}
onClick={()=>handleQuickAction(action)}
className="
group
bg-gray-900
border
border-gray-800
rounded-2xl
p-6
text-left
hover:border-blue-500
hover:-translate-y-1
transition-all
duration-300
"
>

<div
className="
bg-blue-600/10
group-hover:bg-blue-600/20
w-12
h-12
rounded-xl
flex
items-center
justify-center
mb-4
transition
"
>
<Icon className="w-5 h-5 text-blue-400"/>
</div>

<h3 className="text-white font-medium mb-1">
{title}
</h3>

<p className="text-gray-400 text-sm">
{description}
</p>

</button>

))}

</div>

</div>

{/* Main Content */}

<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

{/* Meetings */}

<div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl">

<div className="flex justify-between px-6 py-4 border-b border-gray-800">

<h2 className="text-white font-medium">
Meetings
</h2>

<button
onClick={()=>setShowModal(true)}
className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
>
<Plus className="inline w-4 h-4 mr-1"/>
New Meeting
</button>

</div>

{isLoading&&(
<div className="py-12 text-gray-400 flex justify-center gap-2">
<Loader2 className="animate-spin"/>
Loading meetings...
</div>
)}

{isError&&(
<div className="m-6 text-red-400 flex gap-2">
<AlertCircle/>
Could not load meetings
</div>
)}

{!isLoading&&!isError&&meetings.length===0&&(

<div className="py-16 flex flex-col items-center">

<Calendar className="w-14 h-14 text-gray-600 mb-4"/>

<h3 className="text-white text-lg mb-2">
No meetings scheduled
</h3>

<p className="text-gray-500">
Create your first meeting to get started.
</p>

</div>

)}

{meetings.map((meeting:Meeting)=>(

<div
key={meeting._id}
className="
flex
justify-between
items-center
px-6
py-4
border-t
border-gray-800
hover:bg-gray-800/30
transition
"
>

<div>

<p className="text-white font-medium">
{meeting.title}
</p>

<p className="text-gray-400 text-xs">
{meeting.date}
</p>

</div>

<button
onClick={()=>navigate(`/meeting/${meeting._id}`)}
className="
bg-blue-600
text-white
px-3
py-1
rounded-lg
text-xs
hover:bg-blue-700
"
>
Join
</button>

</div>

))}

</div>

{/* Sidebar Widgets */}

<div className="space-y-6">

{/* Upcoming Meetings */}

<div className="bg-gray-900 border border-gray-800 rounded-2xl">

<div className="px-6 py-4 border-b border-gray-800">

<h2 className="text-white font-medium">
Upcoming Meetings
</h2>

</div>

<div className="p-4 space-y-3">

{meetings.slice(0,3).map((meeting:any)=>(

<div
key={meeting._id}
className="border border-gray-800 rounded-xl p-4"
>

<p className="text-white font-medium">
{meeting.title}
</p>

<p className="text-gray-400 text-sm">
{meeting.date}
</p>

</div>

))}

</div>

</div>

{/* Activity */}

<div className="bg-gray-900 border border-gray-800 rounded-2xl">

<div className="px-6 py-4 border-b border-gray-800">

<h2 className="text-white font-medium">
Recent Activity
</h2>

</div>

{recentActivities.map(item=>(

<div
key={item.id}
className="px-6 py-4 border-b border-gray-800"
>

<p className="text-white text-sm">
{item.title}
</p>

<p className="text-gray-400 text-xs">
{item.time}
</p>

</div>

))}

</div>

</div>

</div>

</Layout>
)
}