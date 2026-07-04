import mongoose, { Document, Schema, Model } from "mongoose"

/* ================= NOTIFICATION ================= */

export interface INotification extends Document {
    user: mongoose.Types.ObjectId

    sender?: mongoose.Types.ObjectId

    title: string

    message: string

    type:
    | "meeting_created"
    | "team_invite"
    | "meeting_invite"
    | "meeting_started"
    | "meeting_ended"
    | "member_added"
    | "member_removed"
    | "recording_ready"
    | "summary_ready"
    | "transcript_ready"
    | "system"

    referenceId?: mongoose.Types.ObjectId

    referenceModel?: string

    isRead: boolean

    createdAt: Date
    updatedAt: Date
}

const notificationSchema = new Schema<INotification>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        message: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            enum: [
                "meeting_created",
                "team_invite",
                "meeting_invite",
                "meeting_started",
                "meeting_ended",
                "member_added",
                "member_removed",
                "recording_ready",
                "summary_ready",
                "transcript_ready",
                "system",
            ],
            default: "system",
        },

        referenceId: {
            type: Schema.Types.ObjectId,
        },

        referenceModel: {
            type: String,
            default: "",
        },

        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

const Notification: Model<INotification> =
    mongoose.model<INotification>(
        "Notification",
        notificationSchema
    )

export default Notification