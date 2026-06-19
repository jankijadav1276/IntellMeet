import {
Monitor,
Smartphone,
Globe,
LogOut,
ShieldCheck
} from "lucide-react"
import {useState} from "react"


const demoSessions=[
{
id:1,
device:"Windows PC",
browser:"Chrome",
location:"India",
active:true,
lastActive:"Active now"
},
{
id:2,
device:"Android Phone",
browser:"Chrome Mobile",
location:"India",
active:false,
lastActive:"2 days ago"
}
]


export default function ManageSessions(){


const [sessions,setSessions]=useState(demoSessions)



const logoutSession=(id:number)=>{


setSessions(
sessions.filter(session=>session.id!==id)
)


/*

Backend later:

await axios.delete(
`/api/users/session/${id}`
)

*/


}



return(

<div className="space-y-6">


{/* Header */}

<div>

<h1 className="text-2xl font-bold">
Manage Sessions
</h1>


<p className="text-gray-400 mt-1">
Manage devices where your IntellMeet account is logged in
</p>


</div>





{/* Security Info */}

<div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-5 flex gap-3">


<ShieldCheck className="text-blue-400"/>


<div>

<h3 className="font-semibold">
Account Security
</h3>


<p className="text-gray-400 text-sm mt-1">

Remove unknown devices to keep your account secure.

</p>


</div>


</div>





{/* Sessions */}


<div className="space-y-4">


{
sessions.map(session=>(


<div

key={session.id}

className="bg-[#181818] border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5"

>



<div className="flex items-center gap-4">


<div className="w-12 h-12 rounded-xl bg-[#222] flex items-center justify-center">


{
session.device.includes("Phone")

?

<Smartphone/>

:

<Monitor/>

}


</div>




<div>


<h3 className="font-semibold">

{session.device}

</h3>


<p className="text-gray-400 text-sm">

{session.browser} • {session.location}

</p>



<p className="text-gray-500 text-sm mt-1">

{session.lastActive}

</p>


</div>



</div>





<div className="flex items-center gap-3">


{
session.active &&

<span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">

Current

</span>

}




{
!session.active &&

<button

onClick={()=>logoutSession(session.id)}

className="flex items-center gap-2 bg-red-600/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition"

>


<LogOut size={16}/>

Logout


</button>


}



</div>




</div>


))

}


</div>



</div>


)

}