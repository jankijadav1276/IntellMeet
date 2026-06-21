import {NavLink,Outlet} from "react-router-dom"
import {
User,
Info,
Settings,
Lock,
Monitor,
Trash2,
HelpCircle,
Shield,
FileText
} from "lucide-react"
import useAuthStore from "../../store/authStore"

const menuItems=[
{name:"Profile",path:"",icon:User},
{name:"About IntellMeet",path:"about",icon:Info},
{name:"Edit Profile",path:"edit",icon:Settings},
{name:"Change Password",path:"change-password",icon:Lock},
{name:"Manage Sessions",path:"sessions",icon:Monitor},
{name:"Privacy & Security",path:"privacy-security",icon:Shield},
{name:"Help & Support",path:"help",icon:HelpCircle},
{name:"Privacy Policy",path:"privacy-policy",icon:FileText},
{name:"Terms & Conditions",path:"terms",icon:FileText},
{name:"Delete Account",path:"delete-account",icon:Trash2}
]

export default function ProfilePage(){

const {user}=useAuthStore()

return(

<div className="min-h-screen bg-[#0f0f0f] text-white p-6">

<div className="max-w-7xl mx-auto grid md:grid-cols-[280px_1fr] gap-6">


{/* Sidebar */}

<div className="bg-[#181818] rounded-2xl p-5 h-fit">


<div className="text-center mb-8">


{
user?.avatar ?

<img
src={user.avatar}
className="w-24 h-24 rounded-full mx-auto object-cover"
/>

:

<div className="w-24 h-24 rounded-full mx-auto bg-blue-600 flex items-center justify-center text-3xl font-bold">

{
user?.name
?.charAt(0)
.toUpperCase()
}

</div>

}


<h2 className="mt-4 text-xl font-semibold">

{user?.name || "User"}

</h2>


<p className="text-gray-400 text-sm">

{user?.email}

</p>


</div>


<div className="space-y-2">

{
menuItems.map(item=>{

const Icon=item.icon

return(

<NavLink
key={item.path}
to={item.path}
end={item.path===""}
className={({isActive})=>
`flex items-center gap-3 px-4 py-3 rounded-xl transition
${isActive?
"bg-blue-600":
"hover:bg-[#252525] text-gray-300"}`
}
>

<Icon size={18}/>

<span>
{item.name}
</span>

</NavLink>

)

})
}

</div>


</div>



{/* Content */}

<div className="bg-[#181818] rounded-2xl p-6">

<Outlet/>

</div>


</div>

</div>

)

}