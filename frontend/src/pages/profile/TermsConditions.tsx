import {
FileText,
UserCheck,
Video,
ShieldCheck,
AlertTriangle,
Ban,
CreditCard
} from "lucide-react"
import BackToDashboard from "../../components/profile/BackToDashboard"

export default function TermsConditions(){


const sections=[

{
title:"Acceptance of Terms",
icon:FileText,
text:"By accessing and using IntellMeet, you agree to follow these terms and conditions. If you do not agree with these terms, please do not use our services."
},


{
title:"Account Responsibility",
icon:UserCheck,
text:"Users are responsible for maintaining the security of their account credentials and ensuring that account information remains accurate."
},


{
title:"Meeting Usage",
icon:Video,
text:"Users must use IntellMeet meetings responsibly and should not use the platform for illegal activities, harmful content or unauthorized access."
},


{
title:"Security & Privacy",
icon:ShieldCheck,
text:"We work to protect user information and maintain a secure meeting environment. Users should also follow security best practices."
},


{
title:"Prohibited Activities",
icon:Ban,
text:"Users must not misuse the platform, disrupt services, attempt unauthorized access or interfere with other users' experience."
},


{
title:"Service Availability",
icon:AlertTriangle,
text:"IntellMeet may update, improve or temporarily modify services to maintain performance and reliability."
},


{
title:"Payments & Plans",
icon:CreditCard,
text:"If paid plans are introduced, users agree to follow the applicable payment, subscription and billing terms."
}

]



return(

<div className="space-y-6">

<BackToDashboard />

{/* Header */}


<div>

<h1 className="text-2xl font-bold">
Terms & Conditions
</h1>


<p className="text-gray-400 mt-1">
Rules and guidelines for using IntellMeet
</p>


</div>







{/* Intro */}


<div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6">


<h2 className="font-semibold">
Welcome to IntellMeet
</h2>


<p className="text-gray-400 mt-2 leading-relaxed">

These terms explain the responsibilities and guidelines
for using our video conferencing and collaboration platform.

</p>


</div>







{/* Sections */}


<div className="space-y-4">


{
sections.map((section)=>{


const Icon=section.icon


return(


<div

key={section.title}

className="bg-[#181818] border border-white/10 rounded-2xl p-6"

>


<div className="flex gap-4">


<Icon className="text-blue-500"/>


<div>


<h3 className="text-lg font-semibold">

{section.title}

</h3>


<p className="text-gray-400 mt-2 leading-relaxed">

{section.text}

</p>


</div>


</div>


</div>


)


})

}



</div>







{/* Footer */}


<div className="text-center text-gray-500 text-sm py-4">


Last updated: {new Date().toLocaleDateString()}


</div>





</div>

)

}