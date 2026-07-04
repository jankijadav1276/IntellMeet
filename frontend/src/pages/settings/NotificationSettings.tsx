import BackToDashboard from "../../components/settings/BackToDashboard"

const notifications=[

{
title:"Meeting Reminders",
desc:"Get reminders before meetings"
},

{
title:"Meeting Invitations",
desc:"Receive invitation alerts"
},

{
title:"Chat Messages",
desc:"Get chat notifications"
},

{
title:"Product Updates",
desc:"Receive IntellMeet updates"
}

]


export default function NotificationSettings(){


return(

<div>
<BackToDashboard />

<h1 className="
text-3xl
font-bold
">

Notifications

</h1>


<p className="text-gray-500 mt-2">

Manage your alerts

</p>



<div className="
mt-8
space-y-4
">


{
notifications.map((item,index)=>(


<div

key={index}

className="
flex
justify-between
items-center
p-6
rounded-2xl
bg-gray-100
dark:bg-gray-900
"


>


<div>


<h3 className="font-semibold">

{item.title}

</h3>


<p className="text-sm text-gray-500">

{item.desc}

</p>


</div>


<input
type="checkbox"
className="
w-5
h-5
"
/>


</div>


))

}


</div>


</div>

)

}