import {
Video,
Users,
MessageSquare,
ShieldCheck,
Globe,
Zap
} from "lucide-react"

import PageWrapper from "../../components/common/PageWrapper"

export default function About() {

const features = [
{
title: "HD Video Meetings",
description: "Connect with your team through smooth and reliable video meetings.",
icon: Video
},
{
title: "Real Time Collaboration",
description: "Chat, share screens and collaborate instantly during meetings.",
icon: Users
},
{
title: "Smart Communication",
description: "Designed to make online communication simple and productive.",
icon: MessageSquare
},
{
title: "Secure Meetings",
description: "Your meetings and conversations are protected with secure technology.",
icon: ShieldCheck
}
]

return (
<PageWrapper>

<div className="space-y-10 text-white">

<h1 className="text-3xl font-semibold">About IntellMeet</h1>

<p className="text-gray-400">
IntellMeet is a modern video conferencing platform built to simplify online communication.
</p>

<section>
<h2 className="text-lg font-semibold mb-3">Features</h2>

<div className="space-y-4">

{features.map((feature, index) => {
const Icon = feature.icon

return (
<div
key={index}
className="flex gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl"
>

<div className="p-2 bg-gray-800 rounded-lg">
<Icon className="w-5 h-5 text-blue-400" />
</div>

<div>
<h3 className="text-white font-medium">{feature.title}</h3>
<p className="text-gray-400 text-sm">{feature.description}</p>
</div>

</div>
)
})}

</div>
</section>

</div>

</PageWrapper>
)
}