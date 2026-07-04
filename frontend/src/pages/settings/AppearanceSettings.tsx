import useThemeStore from "../../store/themeStore"
import BackToDashboard from "../../components/settings/BackToDashboard"

export default function AppearanceSettings(){


const {
theme,
toggleTheme
}=useThemeStore()



return(

<div>
<BackToDashboard />

<h1 className="
text-3xl
font-bold
">

Appearance

</h1>


<p className="text-gray-500 mt-2">

Customize IntellMeet interface

</p>



<div className="
mt-8
space-y-5
">


<Card
title="Theme"
value={theme}
action={toggleTheme}
/>



<div className="
p-5
rounded-2xl
bg-gray-100
dark:bg-gray-900
">


<h3 className="font-semibold">

Meeting Layout

</h3>


<select className="
mt-3
w-full
p-3
rounded-xl
bg-white
dark:bg-black
">


<option>

Gallery View

</option>


<option>

Speaker View

</option>


</select>


</div>



</div>


</div>

)

}



function Card({title,value,action}:any){

return(

<div className="
flex
justify-between
items-center
p-5
rounded-2xl
bg-gray-100
dark:bg-gray-900
">


<div>

<h3>

{title}

</h3>


<p className="text-gray-500">

{value}

</p>


</div>



<button

onClick={action}

className="
bg-blue-600
text-white
px-5
py-2
rounded-xl
">

Change

</button>


</div>

)

}