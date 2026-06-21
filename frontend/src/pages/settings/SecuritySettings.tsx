const security=[

"Change Password",

"Two Factor Authentication",

"Active Sessions",

"Login History"

]


export default function SecuritySettings(){


return(

<div>


<h1 className="
text-3xl
font-bold
">

Security

</h1>


<p className="text-gray-500 mt-2">

Protect your IntellMeet account

</p>



<div className="
mt-8
space-y-4
">


{
security.map(item=>(


<div className="
flex
justify-between
items-center
p-6
rounded-2xl
bg-gray-100
dark:bg-gray-900
">


<h3>

{item}

</h3>


<button className="
bg-blue-600
text-white
px-4
py-2
rounded-xl
">

Manage

</button>


</div>


))

}


</div>



<div className="
mt-8
p-6
rounded-2xl
border
border-red-500/40
">


<h3 className="text-red-500 font-semibold">

Danger Zone

</h3>


<p className="text-sm text-gray-500 mt-2">

Sign out from all devices

</p>



<button className="
mt-4
bg-red-600
text-white
px-5
py-3
rounded-xl
">

Logout All Devices

</button>


</div>


</div>

)

}