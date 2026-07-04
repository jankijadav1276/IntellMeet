import {
Video,
Users,
Shield,
CircleDot
} from "lucide-react"
import BackToDashboard from "../../components/settings/BackToDashboard"

const settings=[
{
title:"Waiting Room",
desc:"Review participants before they join the meeting",
icon:<Users/>
},
{
title:"Auto Mute Participants",
desc:"Automatically mute participants when joining",
icon:<Video/>
},
{
title:"Screen Sharing",
desc:"Allow participants to share their screen",
icon:<Shield/>
},
{
title:"Meeting Recording",
desc:"Automatically record meetings",
icon:<CircleDot/>
}
]


export default function MeetingSettings(){

return(

<div>
<BackToDashboard />

<h1 className="
text-3xl
font-bold
">

Meeting Settings

</h1>


<p className="
text-gray-500
mt-2
">

Control your IntellMeet meeting experience

</p>



<div className="
mt-8
space-y-4
">


{
settings.map((item,index)=>(


<div

key={index}

className="
flex
items-center
justify-between
p-6
rounded-2xl
bg-gray-100
dark:bg-gray-900
"


>


<div className="
flex
gap-4
items-center
">


<div className="
p-3
rounded-xl
bg-blue-500/10
text-blue-500
">

{item.icon}

</div>


<div>

<h3 className="font-semibold">

{item.title}

</h3>


<p className="text-sm text-gray-500">

{item.desc}

</p>


</div>


</div>



<Toggle/>


</div>


))

}


</div>


</div>

)

}



function Toggle(){

return(

<label className="
relative
inline-flex
cursor-pointer
">


<input
type="checkbox"
className="sr-only peer"
/>


<div className="
w-12
h-6
bg-gray-400
rounded-full
peer
peer-checked:bg-blue-600
after:absolute
after:top-[2px]
after:left-[2px]
after:bg-white
after:h-5
after:w-5
after:rounded-full
after:transition-all
peer-checked:after:translate-x-full
"/>


</label>

)

}