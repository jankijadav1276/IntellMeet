import {
Video,
Mic,
Bell,
Moon,
Building,
Shield
} from "lucide-react"

import {
NavLink,
Outlet
} from "react-router-dom"


const menu=[
{
name:"Workspace",
desc:"Organization settings",
path:"workspace",
icon:<Building/>
},
{
name:"Meetings",
desc:"Meeting preferences",
path:"meeting",
icon:<Video/>
},
{
name:"Audio & Video",
desc:"Devices and quality",
path:"audio-video",
icon:<Mic/>
},
{
name:"Notifications",
desc:"Alerts and reminders",
path:"notifications",
icon:<Bell/>
},
{
name:"Appearance",
desc:"Theme and interface",
path:"appearance",
icon:<Moon/>
},
{
name:"Security",
desc:"Account protection",
path:"security",
icon:<Shield/>
}
]


export default function SettingsPage(){

return(

<div className="
min-h-screen
bg-gray-100
dark:bg-[#0b1120]
p-8
">


<div className="
max-w-7xl
mx-auto
grid
grid-cols-[280px_1fr]
gap-8
">


<div className="
bg-white
dark:bg-[#111827]
rounded-3xl
p-5
">


<h1 className="
text-2xl
font-bold
mb-6
">

Settings

</h1>


{
menu.map(item=>(


<NavLink

key={item.path}

to={item.path}

className={({isActive})=>

`
block
p-4
rounded-xl
mb-2

${
isActive
?
"bg-blue-600 text-white"
:
"hover:bg-gray-100 dark:hover:bg-gray-900"
}

`

}


>


<div className="flex gap-3">

{item.icon}


<div>

<h3 className="font-medium">

{item.name}

</h3>


<p className="text-xs opacity-70">

{item.desc}

</p>


</div>


</div>


</NavLink>


))

}


</div>



<div className="
bg-white
dark:bg-[#111827]
rounded-3xl
p-8
">


<Outlet/>


</div>



</div>


</div>

)

}