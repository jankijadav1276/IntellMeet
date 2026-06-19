import {useState} from "react"
import {
Trash2,
AlertTriangle,
ShieldAlert,
LogOut
} from "lucide-react"
import useAuthStore from "../../store/authStore"


export default function DeleteAccount(){


const {logout}=useAuthStore()


const [confirmText,setConfirmText]=useState("")
const [loading,setLoading]=useState(false)



const handleDelete=async()=>{


if(confirmText!=="DELETE"){

alert("Please type DELETE to confirm account deletion")

return

}



try{


setLoading(true)



/*

Backend later:

await axios.delete(
"/api/user/delete-account"
)

*/



alert("Account deleted successfully")

logout()



}

finally{

setLoading(false)

}


}





return(

<div className="space-y-6">





{/* Header */}


<div>


<h1 className="text-2xl font-bold text-red-400">

Delete Account

</h1>


<p className="text-gray-400 mt-1">

Permanently remove your IntellMeet account

</p>


</div>








{/* Warning */}



<div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-6 flex gap-4">


<AlertTriangle className="text-red-400"/>


<div>


<h2 className="font-semibold text-red-400">

This action cannot be undone

</h2>


<p className="text-gray-400 mt-2 text-sm leading-relaxed">

Deleting your account will remove your profile,
meeting history and account information permanently.

</p>


</div>


</div>








{/* What will be deleted */}



<div className="bg-[#181818] border border-white/10 rounded-2xl p-6">


<div className="flex gap-3 mb-4">


<ShieldAlert className="text-yellow-400"/>


<h2 className="font-semibold">

Data that will be removed

</h2>


</div>




<ul className="space-y-3 text-gray-400 text-sm">


<li>
• Profile information
</li>


<li>
• Meeting history
</li>


<li>
• Account settings
</li>


<li>
• Stored preferences
</li>


</ul>


</div>








{/* Confirmation */}



<div className="bg-[#181818] border border-white/10 rounded-2xl p-6 space-y-4">


<h2 className="font-semibold">

Confirm Account Deletion

</h2>


<p className="text-gray-400 text-sm">

Type <span className="text-red-400 font-semibold">
DELETE
</span> to continue.

</p>




<input


value={confirmText}


onChange={(e)=>setConfirmText(e.target.value)}


placeholder="Type DELETE"


className="w-full bg-[#222] rounded-lg px-4 py-3 outline-none"



/>







<button


onClick={handleDelete}


disabled={loading}


className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl w-full"


>


<Trash2 size={18}/>


{
loading
?
"Deleting..."
:
"Delete Account"
}


</button>



</div>






{/* Logout option */}



<div className="bg-[#181818] border border-white/10 rounded-2xl p-5 flex items-center justify-between">


<div>


<h3 className="font-semibold">

Want to leave temporarily?

</h3>


<p className="text-gray-400 text-sm">

You can logout instead of deleting your account.

</p>


</div>



<button

onClick={logout}

className="flex items-center gap-2 text-blue-400"

>


<LogOut size={18}/>

Logout

</button>



</div>





</div>


)

}