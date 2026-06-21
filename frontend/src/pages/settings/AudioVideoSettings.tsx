import {
Camera,
Mic,
Volume2
} from "lucide-react"


const devices=[
{
title:"Camera",
icon:<Camera/>
},
{
title:"Microphone",
icon:<Mic/>
},
{
title:"Speaker",
icon:<Volume2/>
}
]


export default function AudioVideoSettings(){


return(

<div>


<h1 className="
text-3xl
font-bold
">

Audio & Video

</h1>


<p className="text-gray-500 mt-2">

Manage your meeting devices

</p>




<div className="
mt-8
grid
md:grid-cols-3
gap-5
">


{
devices.map((device,index)=>(


<div

key={index}

className="
p-5
rounded-2xl
bg-gray-100
dark:bg-gray-900
"


>


<div className="
flex
gap-3
items-center
">

{device.icon}

<h3>

{device.title}

</h3>


</div>



<select className="
mt-5
w-full
p-3
rounded-xl
bg-white
dark:bg-black
">


<option>

Default {device.title}

</option>


<option>

External Device

</option>


</select>


</div>


))

}


</div>




<div className="
mt-8
h-60
rounded-2xl
bg-black
flex
items-center
justify-center
text-white
">


Camera Preview


</div>


</div>

)

}