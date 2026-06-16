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
{label:"Meetings this week",value:"8",icon:Video},
{label:"Hours in meetings",value:"6.5",icon:Clock},
{label:"Team members",value:"12",icon:Users},
{label:"Action items",value:"14",icon:BarChart2},
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

<div className="grid grid-cols-4 gap-4 mb-8">
{stats.map(({label,value,icon:Icon})=>(
<div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
<div className="flex justify-between mb-3">
<p className="text-gray-400 text-sm">{label}</p>
<Icon className="w-4 h-4 text-blue-400"/>
</div>
<p className="text-white text-2xl font-semibold">{value}</p>
</div>
))}
</div>

<div className="mb-8">
<h2 className="text-white text-lg font-semibold mb-4">Quick Actions</h2>

<div className="grid grid-cols-3 gap-4">
{quickActions.map(({title,description,icon:Icon,action})=>(
<button
key={title}
onClick={()=>handleQuickAction(action)}
className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-left hover:border-blue-500"
>

<div className="bg-blue-600/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
<Icon className="w-5 h-5 text-blue-400"/>
</div>

<h3 className="text-white font-medium">{title}</h3>
<p className="text-gray-400 text-sm">{description}</p>

</button>
))}
</div>
</div>

<div className="bg-gray-900 border border-gray-800 rounded-xl">

<div className="flex justify-between px-6 py-4 border-b border-gray-800">
<h2 className="text-white font-medium">Meetings</h2>

<button
onClick={()=>setShowModal(true)}
className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
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
<div className="py-16 text-center text-gray-500">
No meetings yet
</div>
)}

{meetings.map((meeting:Meeting)=>(
<div key={meeting._id} className="flex justify-between items-center px-6 py-4 border-t border-gray-800">

<div>
<p className="text-white">{meeting.title}</p>
<p className="text-gray-400 text-xs">{meeting.date}</p>
</div>

<button
onClick={()=>navigate(`/meeting/${meeting._id}`)}
className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs"
>
Join
</button>

</div>
))}

</div>

<div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl">

<div className="px-6 py-4 border-b border-gray-800">
<h2 className="text-white font-medium">Recent Activity</h2>
</div>

{recentActivities.map(item=>(
<div key={item.id} className="px-6 py-4 border-b border-gray-800">
<p className="text-white text-sm">{item.title}</p>
<p className="text-gray-400 text-xs">{item.time}</p>
</div>
))}

</div>

{showModal&&(
<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

<div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">

<h2 className="text-white text-lg mb-4">Create Meeting</h2>

<input
className="w-full bg-gray-800 text-white p-2 rounded mb-3"
placeholder="Meeting title"
value={newMeeting.title}
onChange={e=>setNewMeeting({...newMeeting,title:e.target.value})}
/>

<div className="grid grid-cols-2 gap-3">

<input
type="date"
className="bg-gray-800 text-white p-2 rounded"
value={newMeeting.date}
onChange={e=>setNewMeeting({...newMeeting,date:e.target.value})}
/>

<input
type="time"
className="bg-gray-800 text-white p-2 rounded"
value={newMeeting.time}
onChange={e=>setNewMeeting({...newMeeting,time:e.target.value})}
/>

</div>

{formError&&(
<p className="text-red-400 text-sm mt-3">{formError}</p>
)}

<div className="flex gap-3 mt-5">

<button
onClick={closeModal}
className="flex-1 bg-gray-700 text-white py-2 rounded"
>
Cancel
</button>

<button
onClick={handleCreateMeeting}
className="flex-1 bg-blue-600 text-white py-2 rounded"
>
Create
</button>

</div>

</div>

</div>
)}

</Layout>
)
}