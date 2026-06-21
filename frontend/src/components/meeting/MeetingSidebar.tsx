import {MessageCircle,Users} from "lucide-react"


export default function MeetingSidebar(){


return(

<div className="
w-80
h-full
bg-[#181818]
border-l
border-gray-800
text-white
p-5
">


<h2 className="
text-xl
font-semibold
mb-5
">

Meeting

</h2>



<div className="
space-y-4
">


<button className="
flex
gap-3
items-center
">

<MessageCircle/>

Chat

</button>



<button className="
flex
gap-3
items-center
">

<Users/>

Participants

</button>



</div>


</div>


)

}