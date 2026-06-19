import {useState} from "react"
import {
Camera,
Save,
User,
Mail
} from "lucide-react"
import useAuthStore from "../../store/authStore"

export default function EditProfilePage(){

const {user,setUser}=useAuthStore()

const [name,setName]=useState(user?.name || "")
const [avatar,setAvatar]=useState(user?.avatar || "")

const [loading,setLoading]=useState(false)


const handleSave=async()=>{

try{

setLoading(true)


if(user){

setUser({
...user,
name,
avatar
})

}


}
finally{

setLoading(false)

}

}


return(

<div className="space-y-6">


{/* Header */}

<div>

<h1 className="text-2xl font-bold">
Edit Profile
</h1>

<p className="text-gray-400 mt-1">
Update your IntellMeet account information
</p>

</div>




{/* Preview */}

<div className="bg-[#181818] border border-white/10 rounded-2xl p-6 flex items-center gap-5">


{
avatar ?

<img
src={avatar}
className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
/>

:

<div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold">

{
user?.name?.charAt(0).toUpperCase() || "U"
}

</div>

}


<div>

<h2 className="text-xl font-semibold">

{user?.name || "User"}

</h2>


<p className="text-gray-400">

{user?.email}

</p>


</div>


</div>





{/* Form */}


<div className="bg-[#181818] border border-white/10 rounded-2xl p-6 space-y-5">



{/* Name */}

<div>

<label className="text-sm text-gray-400">
Full Name
</label>


<div className="flex items-center gap-3 mt-2 bg-[#222] rounded-lg px-4">


<User size={18}/>


<input

value={name}

onChange={(e)=>setName(e.target.value)}

className="bg-transparent outline-none w-full py-3"

/>


</div>


</div>





{/* Email */}

<div>

<label className="text-sm text-gray-400">
Email
</label>


<div className="flex items-center gap-3 mt-2 bg-[#222] rounded-lg px-4 opacity-60">


<Mail size={18}/>


<input

value={user?.email || ""}

disabled

className="bg-transparent outline-none w-full py-3"

/>


</div>


</div>





{/* Avatar */}

<div>

<label className="text-sm text-gray-400">
Profile Image URL
</label>


<div className="flex items-center gap-3 mt-2 bg-[#222] rounded-lg px-4">


<Camera size={18}/>


<input

value={avatar}

onChange={(e)=>setAvatar(e.target.value)}

placeholder="Enter image URL"

className="bg-transparent outline-none w-full py-3"

/>


</div>


</div>





<button

onClick={handleSave}

disabled={loading}

className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl w-full"

>


<Save size={18}/>


{
loading
?
"Saving..."
:
"Save Changes"
}


</button>




</div>


</div>

)

}