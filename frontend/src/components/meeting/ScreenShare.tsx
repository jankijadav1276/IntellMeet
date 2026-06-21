import {Monitor} from "lucide-react"


export default function ScreenShare(){


return(

<div className="
h-full
bg-black
rounded-xl
flex
items-center
justify-center
text-white
flex-col
gap-4
">


<Monitor size={50}/>


<h2 className="text-xl">

Screen Sharing

</h2>


<p className="text-gray-400">

Your screen will appear here

</p>


</div>

)

}