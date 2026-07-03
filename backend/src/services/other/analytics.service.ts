import mongoose from "mongoose";
import Meeting from "../../models/Meeting";

export const getDashboardAnalytics = async (userId: string) => {
  const hostId = new mongoose.Types.ObjectId(userId);

  // Run all queries in parallel for better performance
const [
  totalMeetings,
  weeklyMeetings,
  monthlyMeetings,
  meetingHours,
  totalParticipants,
  aiSummaries,
  activeMeetings,
  completedMeetings,
  scheduledMeetings,
] = await Promise.all([

    
    // Total Meetings
    Meeting.countDocuments({
      host: hostId,
      
    }),

Meeting.aggregate([
  {
    $match: {
      host: hostId,
      startTime: {
        $gte: new Date(
          new Date().setDate(new Date().getDate() - 6)
        ),
      },
    },
  },
  {
    $group: {
      _id: {
       $dateToString: {
        format: "%b %d",
        date: "$startTime",
      },
      },
      meetings: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      _id: 1,
    },
  },
]),

Meeting.aggregate([
  {
    $match: {
      host: hostId,
      startTime: {
        $gte: new Date(
          new Date().setMonth(new Date().getMonth() - 5)
        ),
      },
    },
  },
  {
    $group: {
      _id: {
        $dateToString: {
          format: "%b",
          date: "$startTime",
        },
      },
      meetings: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      _id: 1,
    },
  },
]),

Meeting.aggregate([
  {
    $match: {
      host: hostId,
      endTime: { $exists: true },
    },
  },
  {
    $project: {
      durationMinutes: {
        $divide: [
          {
            $subtract: ["$endTime", "$startTime"],
          },
          1000 * 60,
        ],
      },
    },
  },
  {
    $group: {
      _id: null,
      totalMinutes: {
        $sum: "$durationMinutes",
      },
    },
  },
]),

// Total Participants
Meeting.aggregate([
  {
    $match: {
      host: hostId,
    },
  },
  {
    $project: {
      participantCount: {
        $size: "$participants",
      },
    },
  },
  {
    $group: {
      _id: null,
      totalParticipants: {
        $sum: "$participantCount",
      },
    },
  },
]),

    
// AI Summaries
Meeting.countDocuments({
  host: hostId,
  summary: {
    $exists: true,
    $nin: ["", null],
  },
}),

    // Active Meetings
    Meeting.countDocuments({
      host: hostId,
      status: "active",
    }),

    // Completed Meetings
    Meeting.countDocuments({
      host: hostId,
      status: "completed",
    }),

    // Scheduled Meetings
    Meeting.countDocuments({
      host: hostId,
      status: "scheduled",
    }),
  ]);

// Last 7 days (including today)
interface MeetingChartData {
  day: string;
  meetings: number;
}

const last7Days: MeetingChartData[] = [];

for (let i = 6; i >= 0; i--) {
  const date = new Date();

  date.setDate(date.getDate() - i);

  last7Days.push({
    day: date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    }),
    meetings: 0,
  });
}

// Fill meeting count from MongoDB aggregation
weeklyMeetings.forEach((item: any) => {
  const index = last7Days.findIndex(
    (d) => d.day === item._id
  );

  if (index !== -1) {
    last7Days[index].meetings = item.meetings;
  }
});

interface MonthlyChartData {
  month: string;
  meetings: number;
}

const last6Months: MonthlyChartData[] = [];

for (let i = 5; i >= 0; i--) {
  const date = new Date();

  date.setMonth(date.getMonth() - i);

  last6Months.push({
    month: date.toLocaleString("en-US", {
      month: "short",
    }),
    meetings: 0,
  });
}

monthlyMeetings.forEach((item: any) => {
  const index = last6Months.findIndex(
    (m) => m.month === item._id
  );

  if (index !== -1) {
    last6Months[index].meetings = item.meetings;
  }
});

  return {
    totalMeetings,

    totalMeetingMinutes:
  Math.round(meetingHours[0]?.totalMinutes || 0),

    totalParticipants:
      totalParticipants[0]?.totalParticipants || 0,

    aiSummaries,

    activeMeetings,

    completedMeetings,

    scheduledMeetings,

    weeklyMeetings: last7Days,
    
    monthlyMeetings: last6Months,
  };
};