import {useNavigate} from "react-router-dom"
import {Video, Copy, ArrowRight} from "lucide-react"
import {useState} from "react"


export default function CreateMeetingPage(){

const navigate=useNavigate()

const [meetingId,setMeetingId]=useState("")


const createMeeting=()=>{

const id=
Math.random()
.toString(36)
.substring(2,10)


setMeetingId(id)

}


const joinRoom=()=>{

navigate(`/meeting/${meetingId}`)

}



return(

<div className="
min-h-screen
bg-[#0f0f0f]
text-white
flex
items-center
justify-center
">


<div className="
bg-[#181818]
p-8
rounded-2xl
w-[420px]
space-y-6
">


<div className="
flex
items-center
gap-3
">

<Video/>

<h1 className="
text-2xl
font-semibold
">

Create Meeting

</h1>


</div>



<p className="
text-gray-400
">

Start a new IntellMeet meeting room

</p>



<button

onClick={createMeeting}

className="
w-full
bg-blue-600
py-3
rounded-lg
flex
justify-center
gap-2
"

>

Create Meeting

</button>



{
meetingId &&

<div className="
bg-black
p-4
rounded-lg
space-y-3
">


<p>
Meeting ID
</p>


<div className="
flex
justify-between
bg-[#222]
p-3
rounded
">


<span>
{meetingId}
</span>


<Copy size={18}/>


</div>



<button

onClick={joinRoom}

className="
w-full
bg-green-600
py-3
rounded-lg
flex
justify-center
gap-2
"

>

Join Room

<ArrowRight size={18}/>

</button>



</div>

}



</div>


</div>

)

}