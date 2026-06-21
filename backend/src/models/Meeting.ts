import mongoose, { Document, Schema, Model } from "mongoose"

/* ================= CHAT ================= */

export interface IChat {
  userId: mongoose.Types.ObjectId
  name: string
  message: string
  timestamp: Date
}

/* ================= PARTICIPANT ================= */

export interface IParticipant {
  user: mongoose.Types.ObjectId
  role: "host" | "participant"

  joinedAt: Date
  leftAt?: Date

  isActive: boolean
}

/* ================= MEETING ================= */

export interface IMeeting extends Document {
  title: string
  description: string

  host: mongoose.Types.ObjectId

  participants: IParticipant[]

  meetingCode: string

  status:
    | "scheduled"
    | "active"
    | "completed"

  startTime: Date
  endTime?: Date

  duration: number

  maxParticipants: number

  totalParticipantsJoined: number

  chats: IChat[]

  createdAt: Date
  updatedAt: Date
}

const participantSchema = new Schema<IParticipant>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["host", "participant"],
      default: "participant",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    leftAt: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
)

const chatSchema = new Schema<IChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
)

const meetingSchema = new Schema<IMeeting>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [participantSchema],

    meetingCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "scheduled",
        "active",
        "completed",
      ],
      default: "scheduled",
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
    },

    duration: {
      type: Number,
      default: 30,
    },

    maxParticipants: {
      type: Number,
      default: 50,
    },

    totalParticipantsJoined: {
      type: Number,
      default: 0,
    },

    chats: [chatSchema],
  },
  {
    timestamps: true,
  }
)

const Meeting: Model<IMeeting> =
  mongoose.model<IMeeting>(
    "Meeting",
    meetingSchema
  )

export default Meeting