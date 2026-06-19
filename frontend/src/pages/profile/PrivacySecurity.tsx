import {
ShieldCheck,
Lock,
Bell,
Video,
Database,
CheckCircle
} from "lucide-react"
import {useState} from "react"


export default function PrivacySecurity(){


const [twoFactor,setTwoFactor]=useState(false)
const [loginAlert,setLoginAlert]=useState(true)
const [privateMeeting,setPrivateMeeting]=useState(true)



return(

<div className="space-y-6">



{/* Header */}

<div>

<h1 className="text-2xl font-bold">
Privacy & Security
</h1>


<p className="text-gray-400 mt-1">
Control your IntellMeet security and privacy settings
</p>


</div>






{/* Security Status */}

<div className="bg-green-600/10 border border-green-500/20 rounded-2xl p-6 flex gap-4">


<ShieldCheck className="text-green-400"/>


<div>


<h2 className="font-semibold">
Your Account is Protected
</h2>


<p className="text-gray-400 text-sm mt-1">

We use secure authentication to protect your IntellMeet account.

</p>


</div>


</div>







{/* Security Settings */}


<div className="bg-[#181818] border border-white/10 rounded-2xl p-6 space-y-5">


<h2 className="text-xl font-semibold">
Security Settings
</h2>





{/* 2FA */}


<div className="flex items-center justify-between">


<div className="flex gap-3">


<Lock/>


<div>

<h3 className="font-medium">
Two Factor Authentication
</h3>


<p className="text-gray-400 text-sm">

Add extra protection to your account

</p>


</div>


</div>




<button

onClick={()=>setTwoFactor(!twoFactor)}

className={`w-12 h-6 rounded-full transition
${twoFactor?"bg-blue-600":"bg-gray-600"}`}

>


<div

className={`w-5 h-5 bg-white rounded-full transition transform
${twoFactor?"translate-x-6":"translate-x-1"}`}

/>


</button>


</div>







{/* Login Alert */}


<div className="flex items-center justify-between">


<div className="flex gap-3">


<Bell/>


<div>


<h3 className="font-medium">
Login Alerts
</h3>


<p className="text-gray-400 text-sm">

Get notified about new logins

</p>


</div>


</div>



<button

onClick={()=>setLoginAlert(!loginAlert)}

className={`w-12 h-6 rounded-full transition
${loginAlert?"bg-blue-600":"bg-gray-600"}`}

>


<div

className={`w-5 h-5 bg-white rounded-full transition transform
${loginAlert?"translate-x-6":"translate-x-1"}`}

/>


</button>



</div>






</div>








{/* Meeting Privacy */}


<div className="bg-[#181818] border border-white/10 rounded-2xl p-6 space-y-5">


<h2 className="text-xl font-semibold">
Meeting Privacy
</h2>




<div className="flex items-center justify-between">


<div className="flex gap-3">


<Video/>


<div>


<h3 className="font-medium">
Private Meetings
</h3>


<p className="text-gray-400 text-sm">

Require permission before joining meetings

</p>


</div>


</div>



<button

onClick={()=>setPrivateMeeting(!privateMeeting)}

className={`w-12 h-6 rounded-full transition
${privateMeeting?"bg-blue-600":"bg-gray-600"}`}

>


<div

className={`w-5 h-5 bg-white rounded-full transition transform
${privateMeeting?"translate-x-6":"translate-x-1"}`}

/>


</button>


</div>


</div>









{/* Data Control */}


<div className="bg-[#181818] border border-white/10 rounded-2xl p-6">


<div className="flex gap-3">


<Database/>


<div>


<h2 className="font-semibold">
Data Protection
</h2>


<p className="text-gray-400 text-sm mt-2">

Your profile information and meeting data are handled securely.

</p>


<div className="flex items-center gap-2 text-green-400 mt-3">

<CheckCircle size={16}/>

Security checks enabled

</div>


</div>


</div>


</div>





</div>


)

}