import {useState} from "react"
import {Link,useNavigate} from "react-router-dom"
import {Eye,EyeOff,Video} from "lucide-react"

import useAuthStore from "../../store/authStore"
import authService from "../../services/authService"

export default function LoginPage(){

const navigate=useNavigate()

const login=useAuthStore((state)=>state.login)

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [showPassword,setShowPassword]=useState(false)

const [errors,setErrors]=useState({
email:"",
password:"",
})


function validate(){

const newErrors={
email:"",
password:"",
}

if(!email){
newErrors.email="Email is required"
}
else if(!/\S+@\S+\.\S+/.test(email)){
newErrors.email="Enter a valid email"
}

if(!password){
newErrors.password="Password is required"
}
else if(password.length<6){
newErrors.password="Password must be at least 6 characters"
}

setErrors(newErrors)

return !newErrors.email&&!newErrors.password

}


async function handleSubmit(e:React.FormEvent){

e.preventDefault()

if(!validate())return

try{

const response=await authService.login({
email,
password
})


login(
{
_id:response._id,
name:response.name,
email:response.email,
role:response.role,
createdAt:new Date().toISOString()
},
response.token
)


navigate("/dashboard")

}

catch(error:any){

alert(
error.response?.data?.message||"Login failed"
)

}

}


return(

<div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">

<div className="w-full max-w-md">


<div className="flex items-center justify-center gap-2 mb-8">

<div className="bg-blue-600 p-2 rounded-lg">

<Video className="w-6 h-6 text-white"/>

</div>

<span className="text-white text-2xl font-semibold">
IntellMeet
</span>

</div>



<div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">


<h1 className="text-white text-2xl font-semibold mb-1">
Welcome back
</h1>


<p className="text-gray-400 text-sm mb-6">
Sign in to your account
</p>



<form onSubmit={handleSubmit} className="space-y-4">


<div>

<label className="text-gray-300 text-sm block mb-1.5">
Email
</label>


<input

type="email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

placeholder="you@example.com"

className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"

/>


{errors.email&&(
<p className="text-red-400 text-xs mt-1">
{errors.email}
</p>
)}

</div>





<div>

<label className="text-gray-300 text-sm block mb-1.5">
Password
</label>


<div className="relative">


<input

type={showPassword?"text":"password"}

value={password}

onChange={(e)=>setPassword(e.target.value)}

placeholder="••••••••"

className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm pr-10 focus:outline-none focus:border-blue-500"

/>



<button

type="button"

onClick={()=>setShowPassword(!showPassword)}

className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"

>

{
showPassword?
<EyeOff className="w-4 h-4"/>
:
<Eye className="w-4 h-4"/>
}

</button>


</div>



{errors.password&&(
<p className="text-red-400 text-xs mt-1">
{errors.password}
</p>
)}

</div>





<div className="flex justify-end">

<a
href="#"
className="text-blue-400 text-xs"
>
Forgot password?
</a>

</div>





<button

type="submit"

className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm"

>

Sign in

</button>



</form>




<p className="text-gray-400 text-sm text-center mt-6">

Don't have an account?{" "}

<Link
to="/signup"
className="text-blue-400"
>
Sign up
</Link>

</p>



</div>


</div>

</div>

)

}