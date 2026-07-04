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


/*================== Waiting Participant ==================*/

export interface IWaitingParticipant {
  user: mongoose.Types.ObjectId

  name: string

  joinedAt: Date
}

/* ================= MEETING ================= */

export interface IMeeting extends Document {
  title: string
  description: string

  host: mongoose.Types.ObjectId

  team?: mongoose.Types.ObjectId

  participants: IParticipant[]

  waitingParticipants: IWaitingParticipant[]

  autoAdmit: boolean

  meetingCode: string

  meetingLink: string

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

  transcript?: {
    speaker: string
    text: string
    timestamp: Date
  }[]

  summary?: string

  actionItems?: {
    task: string
    assignee?: string
    status?: "pending" | "completed"
  }[]

  insights?: string

  keyDecisions?: string[]

  aiGenerated?: boolean

  aiGeneratedAt?: Date


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

const waitingParticipantSchema = new Schema<IWaitingParticipant>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    joinedAt: {
      type: Date,
      default: Date.now,
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

    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
    },

    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [participantSchema],

    waitingParticipants: {
      type: [waitingParticipantSchema],
      default: [],
    },

    autoAdmit: {
      type: Boolean,
      default: false,
    },

    meetingCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    meetingLink: {
      type: String,
      default: "",
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
    transcript: [
      {
        speaker: {
          type: String,
          trim: true,
        },

        text: {
          type: String,
          trim: true,
        },

        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    summary: {
      type: String,
      default: "",
    },

    insights: {
      type: String,
      default: "",
    },

    actionItems: [
      {
        task: {
          type: String,
          required: true,
          trim: true,
        },

        assignee: {
          type: String,
          default: "",
          trim: true,
        },

        status: {
          type: String,
          enum: ["pending", "completed"],
          default: "pending",
        },
      },
    ],

    keyDecisions: [
      {
        type: String,
        trim: true,
      },
    ],

    aiGenerated: {
      type: Boolean,
      default: false,
    },

    aiGeneratedAt: {
      type: Date,
    },
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