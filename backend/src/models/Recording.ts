import mongoose,{Schema,Model} from "mongoose"

export interface IRecording{
meetingId:mongoose.Types.ObjectId
createdBy:mongoose.Types.ObjectId
videoUrl?:string
duration:number
status:"recording"|"completed"
createdAt?:Date
updatedAt?:Date
}


const recordingSchema=new Schema<IRecording>(
{
meetingId:{
type:Schema.Types.ObjectId,
ref:"Meeting",
required:true,
},

createdBy:{
type:Schema.Types.ObjectId,
ref:"User",
required:true,
},

videoUrl:{
type:String,
default:"",
},

duration:{
type:Number,
default:0,
},

status:{
type:String,
enum:[
"recording",
"completed",
],
default:"recording",
},

},
{
timestamps:true,
}
)


const Recording:Model<IRecording>=mongoose.model<IRecording>(
"Recording",
recordingSchema
)


export default Recording