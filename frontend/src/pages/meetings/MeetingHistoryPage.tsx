import {Clock, Users} from "lucide-react"


const meetings=[

{
title:"Project Discussion",
date:"20 June 2026",
duration:"45 min",
people:5
},

{
title:"Team Meeting",
date:"18 June 2026",
duration:"30 min",
people:3
}

]


export default function MeetingHistoryPage(){


return(

<div className="
min-h-screen
bg-[#0f0f0f]
text-white
p-8
">


<h1 className="
text-3xl
font-semibold
mb-8
">

Meeting History

</h1>



<div className="
space-y-4
">


{
meetings.map((meeting,index)=>(


<div

key={index}

className="
bg-[#181818]
p-5
rounded-xl
flex
justify-between
items-center
"


>


<div>

<h2 className="
font-semibold
">

{meeting.title}

</h2>


<p className="
text-gray-400
">

{meeting.date}

</p>


</div>



<div className="
flex
gap-5
text-gray-400
">


<span className="flex gap-2">

<Clock size={18}/>

{meeting.duration}

</span>


<span className="flex gap-2">

<Users size={18}/>

{meeting.people}

</span>



</div>



</div>


))

}


</div>


</div>


)

}