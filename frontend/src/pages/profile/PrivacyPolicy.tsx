import {
ShieldCheck,
Database,
Lock,
UserCheck,
Share2,
Trash2
} from "lucide-react"
import BackToDashboard from "../../components/profile/BackToDashboard"

export default function PrivacyPolicy(){


const sections=[

{
title:"Information We Collect",
icon:UserCheck,
text:"IntellMeet collects account information such as name, email address and profile details to provide meeting and collaboration services."
},


{
title:"How We Use Information",
icon:Database,
text:"Your information is used to manage accounts, create meetings, improve platform performance and provide a better user experience."
},


{
title:"Data Security",
icon:Lock,
text:"We use secure authentication and modern security practices to protect your personal information and meeting data."
},


{
title:"Sharing Information",
icon:Share2,
text:"IntellMeet does not sell your personal information. Data is only shared when required to provide services or comply with legal requirements."
},


{
title:"Account Data Control",
icon:Trash2,
text:"Users can manage their profile information and request account deletion through account settings."
}


]



return(

<div className="space-y-6">
<BackToDashboard />


{/* Header */}


<div>

<h1 className="text-2xl font-bold">
Privacy Policy
</h1>


<p className="text-gray-400 mt-1">
Learn how IntellMeet protects and handles your information
</p>


</div>







<div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6 flex gap-4">


<ShieldCheck className="text-blue-400"/>


<div>


<h2 className="font-semibold">
Your Privacy Matters
</h2>


<p className="text-gray-400 text-sm mt-2">

IntellMeet is designed with privacy and security in mind.
We aim to provide transparent control over your information.

</p>


</div>


</div>








{/* Policy Sections */}



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


<h3 className="font-semibold text-lg">

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








{/* Last Updated */}


<div className="text-center text-gray-500 text-sm py-4">

Last updated: {new Date().toLocaleDateString()}

</div>




</div>

)

}