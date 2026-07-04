

const users=[

{
name:"Janki"
},

{
name:"Rahul"
},

{
name:"Alex"
},

{
name:"Guest"
}

]


export default function VideoGrid(){


return(

<div className="
h-full
grid
grid-cols-2
gap-3
p-4
">


{
users.map((user,index)=>(


<div

key={index}

className="
bg-[#202020]
rounded-xl
flex
items-center
justify-center
relative
"


>


<div className="
h-20
w-20
rounded-full
bg-gray-700
flex
items-center
justify-center
text-2xl
">

{user.name[0]}

</div>



<div className="
absolute
bottom-3
left-3
bg-black/60
px-3
py-1
rounded
text-sm
">

🎤 {user.name}

</div>



</div>


))

}


</div>


)

}