import {create} from "zustand"
import type {User} from "../types"

interface AuthState{
user:User|null
token:string|null
setUser:(user:User)=>void
setToken:(token:string)=>void
login:(user:User,token:string)=>void
logout:()=>void
isAuthenticated:()=>boolean
}

const useAuthStore=create<AuthState>((set,get)=>({

user:JSON.parse(localStorage.getItem("user")||"null"),

token:localStorage.getItem("token"),


setUser:(user)=>{

localStorage.setItem(
"user",
JSON.stringify(user)
)

set({user})

},


setToken:(token)=>{

localStorage.setItem(
"token",
token
)

set({token})

},


login:(user,token)=>{

localStorage.setItem(
"user",
JSON.stringify(user)
)

localStorage.setItem(
"token",
token
)

set({
user,
token
})

},

logout:()=>{

localStorage.removeItem("user")
localStorage.removeItem("token")
set({
user:null,
token:null
})
},

isAuthenticated:()=>{
return get().token!==null
}
}))

export default useAuthStore