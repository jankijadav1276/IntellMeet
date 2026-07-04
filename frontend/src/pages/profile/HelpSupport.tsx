import {
MessageSquare,
Mail,
Video,
Wifi,
Bug,
ChevronDown
} from "lucide-react"
import {useState} from "react"
import BackToDashboard from "../../components/profile/BackToDashboard"

export default function HelpSupport(){


const [open,setOpen]=useState<number|null>(null)



const faqs=[

{
q:"How do I create a meeting?",
a:"Go to the Meetings page and click on New Meeting. Share the generated meeting link with participants."
},

{
q:"Why is my camera or microphone not working?",
a:"Check browser permissions and make sure your device microphone and camera are enabled."
},

{
q:"Can I join a meeting without an account?",
a:"Yes, participants can join using a valid IntellMeet meeting link."
},

{
q:"Is my meeting data secure?",
a:"Yes, IntellMeet uses secure authentication and protected communication."
}

]



return(

<div className="space-y-6">

<BackToDashboard />

{/* Header */}

<div>

<h1 className="text-2xl font-bold">
Help & Support
</h1>


<p className="text-gray-400 mt-1">
Get help with your IntellMeet experience
</p>


</div>






{/* Support Cards */}


<div className="grid md:grid-cols-3 gap-4">



<div className="bg-[#181818] border border-white/10 rounded-xl p-5">


<MessageSquare className="text-blue-500"/>


<h3 className="font-semibold mt-4">
Contact Support
</h3>


<p className="text-gray-400 text-sm mt-2">

Need help? Contact the IntellMeet team.

</p>


<button className="mt-4 text-blue-400">

Open Chat

</button>


</div>





<div className="bg-[#181818] border border-white/10 rounded-xl p-5">


<Mail className="text-purple-500"/>


<h3 className="font-semibold mt-4">
Email Support
</h3>


<p className="text-gray-400 text-sm mt-2">

Send your questions and feedback.

</p>


<button className="mt-4 text-blue-400">

support@intellmeet.com

</button>


</div>






<div className="bg-[#181818] border border-white/10 rounded-xl p-5">


<Bug className="text-red-400"/>


<h3 className="font-semibold mt-4">
Report Problem
</h3>


<p className="text-gray-400 text-sm mt-2">

Report bugs or technical issues.

</p>


<button className="mt-4 text-blue-400">

Report Issue

</button>


</div>



</div>








{/* Common Issues */}



<div className="bg-[#181818] border border-white/10 rounded-2xl p-6">


<h2 className="text-xl font-semibold mb-5">
Common Issues
</h2>




<div className="space-y-3">


<div className="flex items-center gap-3 text-gray-300">

<Video size={18}/>

Camera and microphone problems

</div>


<div className="flex items-center gap-3 text-gray-300">

<Wifi size={18}/>

Connection and meeting quality issues

</div>


</div>



</div>








{/* FAQ */}


<div className="bg-[#181818] border border-white/10 rounded-2xl p-6">


<h2 className="text-xl font-semibold mb-5">
Frequently Asked Questions
</h2>



<div className="space-y-3">


{
faqs.map((faq,index)=>(


<div
key={index}
className="border border-white/10 rounded-xl overflow-hidden"
>


<button

onClick={()=>setOpen(open===index?null:index)}

className="w-full flex justify-between items-center p-4 text-left"

>


<span>
{faq.q}
</span>


<ChevronDown

size={18}

className={`${open===index?"rotate-180":""} transition`}

/>


</button>





{
open===index &&

<div className="px-4 pb-4 text-gray-400 text-sm">

{faq.a}

</div>

}



</div>



))

}


</div>



</div>







</div>

)

}