import {
Video,
Users,
MessageSquare,
ShieldCheck,
Globe,
Zap
} from "lucide-react"

export default function About(){

const features=[
{
title:"HD Video Meetings",
description:"Connect with your team through smooth and reliable video meetings.",
icon:Video
},
{
title:"Real Time Collaboration",
description:"Chat, share screens and collaborate instantly during meetings.",
icon:Users
},
{
title:"Smart Communication",
description:"Designed to make online communication simple and productive.",
icon:MessageSquare
},
{
title:"Secure Meetings",
description:"Your meetings and conversations are protected with secure technology.",
icon:ShieldCheck
}
]


return(

<div className="space-y-8">


{/* Hero */}

<div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-2xl p-8">


<div className="flex items-center gap-3">

<Globe className="text-blue-500"/>

<h1 className="text-3xl font-bold">
About IntellMeet
</h1>

</div>


<p className="text-gray-300 mt-4 max-w-3xl leading-relaxed">

IntellMeet is a modern video conferencing platform
built to simplify online communication.
It helps users create meetings, connect with people,
share ideas and collaborate from anywhere.

</p>


</div>





{/* Mission */}


<div className="bg-[#181818] border border-white/10 rounded-2xl p-6">


<h2 className="text-xl font-semibold">
Our Mission
</h2>


<p className="text-gray-400 mt-3 leading-relaxed">

Our mission is to build a simple, secure and
powerful meeting experience that allows people
to communicate effectively without complexity.

</p>


</div>





{/* Features */}


<div>


<h2 className="text-xl font-semibold mb-4">
Why IntellMeet?
</h2>


<div className="grid md:grid-cols-2 gap-4">


{
features.map((feature)=>{

const Icon=feature.icon


return(

<div
key={feature.title}
className="bg-[#181818] border border-white/10 rounded-xl p-5 hover:border-blue-500 transition"
>


<Icon className="text-blue-500"/>


<h3 className="font-semibold text-lg mt-4">

{feature.title}

</h3>


<p className="text-gray-400 mt-2 text-sm">

{feature.description}

</p>


</div>


)

})

}


</div>


</div>





{/* Technology */}


<div className="bg-[#181818] border border-white/10 rounded-2xl p-6">


<div className="flex items-center gap-3">

<Zap className="text-yellow-400"/>

<h2 className="text-xl font-semibold">
Built With Modern Technology
</h2>

</div>



<div className="flex flex-wrap gap-3 mt-5">


{
[
"React",
"TypeScript",
"Tailwind CSS",
"Node.js",
"Express",
"MongoDB",
"WebRTC",
"Socket.io"
].map(item=>(

<span
key={item}
className="px-4 py-2 rounded-full bg-white/10 text-sm"
>

{item}

</span>

))
}


</div>


</div>





{/* Footer */}


<div className="text-center text-gray-400 py-4">


<p>
Built with ❤️ for better communication
</p>


<p className="text-sm mt-2">
© {new Date().getFullYear()} IntellMeet
</p>


</div>


</div>

)

}