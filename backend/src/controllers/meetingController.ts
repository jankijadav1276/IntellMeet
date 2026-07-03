import { Response } from "express";
import { v4 as uuidv4 } from "uuid";

import Meeting from "../models/Meeting";
import { AuthRequest } from "../middleware/authMiddleware";

// ===============================
// CREATE MEETING
// ===============================
const createMeeting = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      startTime,
      duration,
    } = req.body;

    if (!title) {
      res.status(400).json({
        success: false,
        message: "Meeting title is required",
      });
      return;
    }

    if (!startTime) {
      res.status(400).json({
        success: false,
        message: "Start time is required",
      });
      return;
    }

    const start = new Date(startTime);

    if (isNaN(start.getTime())) {
      res.status(400).json({
        success: false,
        message: "Invalid startTime format",
      });
      return;
    }

    // Prevent meetings in the past
    if (start < new Date()) {
      res.status(400).json({
        success: false,
        message: "Meeting cannot be scheduled in the past",
      });
      return;
    }

    const meetingDuration =
      Number(duration) > 0
        ? Number(duration)
        : 30;

    const endTime = new Date(
      start.getTime() +
        meetingDuration * 60 * 1000
    );

    const user = req.user as any;

const meetingCode = uuidv4();



    const meeting = await Meeting.create({
      title,
      description,
      host: user._id,
      participants: [
        {
          user: user._id,
          role: "host",
          joinedAt: new Date(),
          isActive: true,
        },
      ],

status:
  start <= new Date()
    ? "active"
    : "scheduled",

totalParticipantsJoined: 1,
      meetingCode,
      startTime: start,
      duration: meetingDuration,
      endTime,
    });

    meeting.meetingLink =
  `${process.env.CLIENT_URL}/join/${meetingCode}`;

await meeting.save();

    res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server Error",
    });
  }
};


// ===============================
// GET MY MEETINGS
// ===============================
const getMyMeetings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user as any;

    const meetings = await Meeting.find({
  $or: [
    { host: user._id },
    {
  participants: {
    $elemMatch: {
      user: user._id,
      isActive: true,
    },
  },
}
  ],
})
      .populate("host", "name email")
     .populate(
        "participants.user",
        "name email"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: meetings.length,
      meetings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server Error",
    });
  }
};

// ===============================
// GET ALL MEETINGS
// ===============================
const getMeetings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const meetings = await Meeting.find()
      .populate("host", "name email")
    .populate(
  "participants.user",
  "name email"
)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: meetings.length,
      meetings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server Error",
    });
  }
};

// ===============================
// GET SINGLE MEETING
// ===============================
const getMeetingById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const meeting = await Meeting.findById(
      req.params.id
    )
      .populate("host", "name email")
      .populate(
  "participants.user",
  "name email"
)

    if (!meeting) {
      res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
      return;
    }

    const user = req.user as any;

    const isHost =
      (
        meeting.host as any
      )._id.toString() ===
      user._id.toString();

  const isParticipant =
  (
    meeting.participants as any[]
  ).some(
    (participant: any) =>
      participant.user._id.toString() ===
      user._id.toString() &&
      participant.isActive
  );

    if (!isHost && !isParticipant) {
      res.status(403).json({
        success: false,
        message:
          "Not authorized to access this meeting",
      });
      return;
    }

    res.status(200).json({
      success: true,
      meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server Error",
    });
  }
};

// ===============================
// UPDATE MEETING
// ===============================
const updateMeeting = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const meeting = await Meeting.findById(
      req.params.id
    );

    if (!meeting) {
      res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
      return;
    }

    const user = req.user as any;

    if (
      meeting.host.toString() !==
      user._id.toString()
    ) {
      res.status(403).json({
        success: false,
        message: "Not authorized",
      });
      return;
    }

    const {
      title,
      description,
      startTime,
      duration,
      status,
    } = req.body;

    const updateData: any = {};

    if (title)
      updateData.title = title;

    if (description !== undefined)
      updateData.description =
        description;

    if (startTime)
      updateData.startTime =
        startTime;

    if (duration)
      updateData.duration =
        duration;

    if (status)
      updateData.status = status;

    const updatedMeeting =
      await Meeting.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Meeting updated successfully",
      meeting: updatedMeeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server Error",
    });
  }
};

// ===============================
// DELETE MEETING
// ===============================
const deleteMeeting = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const meeting = await Meeting.findById(
      req.params.id
    );

    if (!meeting) {
      res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
      return;
    }

    const user = req.user as any;

    if (
      meeting.host.toString() !==
      user._id.toString()
    ) {
      res.status(403).json({
        success: false,
        message: "Not authorized",
      });
      return;
    }

    await meeting.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Meeting deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server Error",
    });
  }
};
// ===============================
// JOIN MEETING BY CODE
// ===============================
const joinMeetingByCode = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { meetingCode } = req.body

    if (!meetingCode) {
      res.status(400).json({
        success: false,
        message: "Meeting code is required",
      })
      return
    }

    const meeting = await Meeting.findOne({ meetingCode })

    if (!meeting) {
      res.status(404).json({
        success: false,
        message: "Meeting not found",
      })
      return
    }

    const user = req.user as any

    const existingParticipant =
  meeting.participants.find(
    (participant: any) =>
      participant.user.toString() ===
      user._id.toString()
  )

  if (!existingParticipant) {

  if (
    meeting.participants.filter(
      (p: any) => p.isActive
    ).length >=
    meeting.maxParticipants
  ) {
    res.status(400).json({
      success: false,
      message: "Meeting is full",
    })
    return
  }

  meeting.participants.push({
    user: user._id,
    role: "participant",
    joinedAt: new Date(),
    isActive: true,
  })

  meeting.totalParticipantsJoined += 1

} else if (!existingParticipant.isActive) {

  existingParticipant.isActive = true

  existingParticipant.leftAt = undefined

  existingParticipant.joinedAt =
    new Date()

  existingParticipant.role =
  existingParticipant.user.toString() ===
  meeting.host.toString()
    ? "host"
    : "participant"
}

if (meeting.status === "scheduled") {
  meeting.status = "active"
}

await meeting.save()

    const populatedMeeting = await Meeting.findById(meeting._id)
      .populate("host", "name email")
      .populate(
  "participants.user",
  "name email"
)

    res.status(200).json({
      success: true,
      message: "Joined meeting successfully",
      meeting: populatedMeeting,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server Error",
    })
  }
}

const updateTranscript = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { transcript } = req.body;

    const meeting = await Meeting.findById(
      req.params.id
    );

    if (!meeting) {
      res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
      return;
    }

    meeting.transcript = transcript || "";

    await meeting.save();

    res.status(200).json({
      success: true,
      transcript: meeting.transcript,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Server Error",
    });
  }
};

export {
  createMeeting,
  getMyMeetings,
  getMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
  joinMeetingByCode,
  updateTranscript,
}