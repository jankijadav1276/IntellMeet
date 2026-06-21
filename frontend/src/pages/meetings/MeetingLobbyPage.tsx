import {useState} from "react"
import {Mic,MicOff,Video,VideoOff,ArrowRight} from "lucide-react"
import {useNavigate} from "react-router-dom"


export default function MeetingLobbyPage(){

const navigate=useNavigate()

const [mic,setMic]=useState(true)
const [camera,setCamera]=useState(true)


return(

<div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">


<div className="bg-[#181818] p-6 rounded-2xl w-[420px] space-y-6">


<h1 className="text-2xl font-semibold">
Ready to join?
</h1>


<div className="h-64 bg-black rounded-xl flex items-center justify-center">


{
camera
?
<div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl">
J
</div>
:
<VideoOff/>
}


</div>


<div className="flex justify-center gap-4">


<button
onClick={()=>setMic(!mic)}
className="p-4 rounded-full bg-[#333]"
>

{
mic
?
<Mic/>
:
<MicOff/>
}

</button>



<button
onClick={()=>setCamera(!camera)}
className="p-4 rounded-full bg-[#333]"
>

{
camera
?
<Video/>
:
<VideoOff/>
}

</button>


</div>



<button

onClick={()=>navigate("/meeting/demo")}

className="w-full bg-blue-600 py-3 rounded-xl flex justify-center items-center gap-2"

>

Join Meeting

<ArrowRight size={18}/>

</button>



</div>


</div>

)

}