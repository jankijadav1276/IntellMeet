import {
Bell,
Moon,
Shield
} from "lucide-react"


const SettingsPage = () => {


return (

<div className="p-6 space-y-6">


<h1 className="
text-3xl
font-semibold
text-white
">

Settings

</h1>



<div className="
bg-[#111827]
border
border-gray-800
rounded-2xl
p-6
space-y-5
">


<SettingItem
icon={<Bell/>}
title="Notifications"
text="Meeting reminders and alerts"
/>


<SettingItem
icon={<Moon/>}
title="Appearance"
text="Manage theme preferences"
/>


<SettingItem
icon={<Shield/>}
title="Privacy"
text="Manage account security"
/>


</div>



</div>

)

}



const SettingItem = ({
icon,
title,
text
}:any)=>{


return (

<div className="
flex
items-center
gap-4
bg-gray-900
rounded-xl
p-4
">


<div className="text-blue-400">

{icon}

</div>


<div>

<h3 className="text-white">

{title}

</h3>

<p className="text-gray-400 text-sm">

{text}

</p>


</div>


</div>

)

}


export default SettingsPage