import {useState} from "react"
import {Link,useNavigate} from "react-router-dom"
import {Eye,EyeOff,Video} from "lucide-react"

import authService from "../../services/authService"
import useAuthStore from "../../store/authStore"

export default function SignupPage(){

const navigate=useNavigate()

const login=useAuthStore((state)=>state.login)

const [form,setForm]=useState({
name:"",
email:"",
password:"",
confirmPassword:"",
})

const [showPassword,setShowPassword]=useState(false)

const [errors,setErrors]=useState({
name:"",
email:"",
password:"",
confirmPassword:"",
})


function handleChange(e:React.ChangeEvent<HTMLInputElement>){

setForm({
...form,
[e.target.name]:e.target.value
})

}


function validate(){

const newErrors={
name:"",
email:"",
password:"",
confirmPassword:"",
}


if(!form.name){
newErrors.name="Name is required"
}


if(!form.email){
newErrors.email="Email is required"
}
else if(!/\S+@\S+\.\S+/.test(form.email)){
newErrors.email="Enter a valid email"
}


if(!form.password){
newErrors.password="Password is required"
}
else if(form.password.length<6){
newErrors.password="Password must be at least 6 characters"
}


if(!form.confirmPassword){
newErrors.confirmPassword="Please confirm your password"
}
else if(form.password!==form.confirmPassword){
newErrors.confirmPassword="Passwords do not match"
}


setErrors(newErrors)

return !Object.values(newErrors).some(Boolean)

}



async function handleSubmit(e:React.FormEvent){

e.preventDefault()

if(!validate())return


try{

const response=await authService.register({

name:form.name,
email:form.email,
password:form.password

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
error.response?.data?.message||"Registration failed"
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
Create an account
</h1>


<p className="text-gray-400 text-sm mb-6">
Start collaborating with your team
</p>



<form onSubmit={handleSubmit} className="space-y-4">



<input

name="name"

value={form.name}

onChange={handleChange}

placeholder="Full name"

className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5"

/>


{errors.name&&
<p className="text-red-400 text-xs">{errors.name}</p>
}





<input

name="email"

value={form.email}

onChange={handleChange}

placeholder="Email"

className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5"

/>


{errors.email&&
<p className="text-red-400 text-xs">{errors.email}</p>
}





<div className="relative">


<input

name="password"

type={showPassword?"text":"password"}

value={form.password}

onChange={handleChange}

placeholder="Password"

className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 pr-10"

/>


<button

type="button"

onClick={()=>setShowPassword(!showPassword)}

className="absolute right-3 top-3 text-gray-400"

>

{
showPassword?
<EyeOff className="w-4 h-4"/>
:
<Eye className="w-4 h-4"/>
}

</button>


</div>


{errors.password&&
<p className="text-red-400 text-xs">{errors.password}</p>
}





<input

name="confirmPassword"

type="password"

value={form.confirmPassword}

onChange={handleChange}

placeholder="Confirm password"

className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5"

/>


{errors.confirmPassword&&
<p className="text-red-400 text-xs">{errors.confirmPassword}</p>
}




<button
type="button"
onClick={handleSubmit}
className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg"
>
Create account
</button>



</form>




<p className="text-gray-400 text-sm text-center mt-6">

Already have an account?{" "}

<Link
to="/login"
className="text-blue-400"
>
Sign in
</Link>

</p>



</div>


</div>

</div>

)

}