import {useState} from "react"
import {
Lock,
Eye,
EyeOff,
Save
} from "lucide-react"

export default function ChangePasswordPage(){

const [currentPassword,setCurrentPassword]=useState("")
const [newPassword,setNewPassword]=useState("")
const [confirmPassword,setConfirmPassword]=useState("")

const [showCurrent,setShowCurrent]=useState(false)
const [showNew,setShowNew]=useState(false)
const [showConfirm,setShowConfirm]=useState(false)

const [loading,setLoading]=useState(false)


const handleChangePassword=async()=>{


if(newPassword!==confirmPassword){

alert("New passwords do not match")
return

}


try{

setLoading(true)


/*
Backend API will come here:

await axios.put(
"/api/user/change-password",
{
currentPassword,
newPassword
}
)

*/


alert("Password updated successfully")


setCurrentPassword("")
setNewPassword("")
setConfirmPassword("")


}
finally{

setLoading(false)

}


}



const PasswordInput=({
value,
setValue,
show,
setShow,
placeholder
}:any)=>{


return(

<div className="flex items-center gap-3 bg-[#222] rounded-lg px-4">


<Lock size={18}/>


<input

type={show?"text":"password"}

value={value}

onChange={(e)=>setValue(e.target.value)}

placeholder={placeholder}

className="bg-transparent outline-none w-full py-3"

/>


<button

type="button"

onClick={()=>setShow(!show)}

className="text-gray-400"

>


{
show
?
<EyeOff size={18}/>
:
<Eye size={18}/>
}


</button>


</div>

)

}



return(

<div className="space-y-6">


{/* Header */}

<div>

<h1 className="text-2xl font-bold">
Change Password
</h1>

<p className="text-gray-400 mt-1">
Keep your IntellMeet account secure
</p>

</div>





<div className="bg-[#181818] border border-white/10 rounded-2xl p-6 space-y-5">



<div>

<label className="text-sm text-gray-400">
Current Password
</label>


<div className="mt-2">

<PasswordInput

value={currentPassword}

setValue={setCurrentPassword}

show={showCurrent}

setShow={setShowCurrent}

placeholder="Enter current password"

/>

</div>


</div>





<div>

<label className="text-sm text-gray-400">
New Password
</label>


<div className="mt-2">

<PasswordInput

value={newPassword}

setValue={setNewPassword}

show={showNew}

setShow={setShowNew}

placeholder="Enter new password"

/>

</div>


</div>





<div>

<label className="text-sm text-gray-400">
Confirm New Password
</label>


<div className="mt-2">

<PasswordInput

value={confirmPassword}

setValue={setConfirmPassword}

show={showConfirm}

setShow={setShowConfirm}

placeholder="Confirm new password"

/>

</div>


</div>






<button

onClick={handleChangePassword}

disabled={loading}

className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl w-full"

>


<Save size={18}/>


{
loading
?
"Updating..."
:
"Update Password"
}


</button>



</div>


</div>

)

}