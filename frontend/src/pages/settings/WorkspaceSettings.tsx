import BackToDashboard from "../../components/settings/BackToDashboard"

export default function WorkspaceSettings(){

return(

<div>
<BackToDashboard />

<h2 className="
text-3xl
font-bold
">

Workspace

</h2>


<p className="
text-gray-500
mt-2
">

Manage your IntellMeet workspace

</p>



<div className="
mt-8
space-y-5
">


<div className="
p-5
rounded-xl
bg-gray-100
dark:bg-gray-900
">


<h3>

Workspace Name

</h3>


<input

className="
mt-3
w-full
p-3
rounded-xl
bg-white
dark:bg-black
"

placeholder="Company / Team name"

/>


</div>




<div className="
p-5
rounded-xl
bg-gray-100
dark:bg-gray-900
">


<h3>

Workspace Members

</h3>


<p className="text-gray-500">

Manage team access

</p>


<button className="
mt-3
bg-blue-600
text-white
px-5
py-2
rounded-xl
">

Manage Members

</button>


</div>


</div>


</div>

)

}