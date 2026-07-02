import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITeamMember {
  user: Types.ObjectId;
  role: "admin" | "member";
  position: string;
  joinedAt: Date;
}

export interface ITeam extends Document {
  name: string;
  createdBy: Types.ObjectId;
  members: ITeamMember[];
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        // Permission Role
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },

        // Organization Position
        position: {
          type: String,
          enum: [
            "Project Manager",
            "Product Manager",
            "Technical Lead",
            "Team Lead",
            "Frontend Developer",
            "Backend Developer",
            "Full Stack Developer",
            "UI/UX Designer",
            "QA Engineer",
            "DevOps Engineer",
            "Business Analyst",
            "Marketing Manager",
            "HR Manager",
            "Sales Executive",
            "Intern",
          ],
          default: "Frontend Developer",
        },

        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITeam>("Team", TeamSchema);