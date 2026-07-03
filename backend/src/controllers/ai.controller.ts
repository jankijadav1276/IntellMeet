import { Request, Response } from "express";
import { generateSummary } from "../services/ai/summary.service";
import { generateActionItems } from "../services/ai/actionItem.service";
import { IMeeting } from "../models/Meeting"; // Import your meeting interface
import { generateKeyDecisions } from "../services/ai/decision.service";
import { buildMeetingContext } from "../utils/transcript.util";
// Extend Express Request type to support properties attached by your middleware safely
interface AuthenticatedMeetingRequest extends Request {
  meeting?: IMeeting; 
  user?: any;
}

/**
 * @desc    Generate an AI summary from a meeting transcript and persist it to the database
 * @route   POST /api/ai/:id/summary
 * @access  Private
 */
const generateMeetingSummary = async (
  req: AuthenticatedMeetingRequest,
  res: Response
): Promise<void> => {
  try {
   
    // Extract the pre-loaded, pre-verified meeting object from your middleware
const meeting = req.meeting;

// 1. Request Validation
if (!meeting) {
  res.status(404).json({
    success: false,
    message: "Meeting document context missing",
  });
  return;
}

const transcript =
  meeting.transcript || []

const aiInput = buildMeetingContext(
  transcript,
  meeting.chats
)

if (
  transcript.length === 0 &&
  meeting.chats.length === 0
) {
  res.status(400).json({
    success: false,
    message:
      "No transcript or chat data found",
  });
  return;
}

    // 2. Delegate to the AI Prompt/Summary Service Layer
    const summary =
  await generateSummary(aiInput);

    // 3. Database Persistence (Saves directly to the pre-fetched document)
    
    meeting.summary = summary;
    await meeting.save();

    res.status(200).json({
      success: true,
      summary,
      meetingId: meeting._id,
    });
  } catch (error) {
    console.error("Summary Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate and save summary",
    });
  }
};

/**
 * @desc    Extract actionable tasks from a transcript and map them into the Kanban schema
 * @route   POST /api/ai/:id/action-items
 * @access  Private
 */
const generateMeetingActionItems = async (
  req: AuthenticatedMeetingRequest,
  res: Response
): Promise<void> => {
  try {
  const meeting = req.meeting;

  if (!meeting) {
    res.status(404).json({
      success: false,
      message: "Meeting document context missing",
    });
    return;
  }

const transcript =
  meeting.transcript || []

const aiInput = buildMeetingContext(
  transcript,
  meeting.chats
)

if (
  transcript.length === 0 &&
  meeting.chats.length === 0
) {
  res.status(400).json({
    success: false,
    message:
      "No transcript or chat data found",
  });
  return;
}

    // 2. Delegate to the AI Action Items Service Layer
    const rawActionItemsResponse = await generateActionItems(aiInput);

    // 3. Safe Parsing Check: Prevents runtime crashing if LLM passes raw string text
    let actionItemsArray: any[] = [];
    try {
      actionItemsArray = typeof rawActionItemsResponse === "string" 
        ? JSON.parse(rawActionItemsResponse) 
        : rawActionItemsResponse;
    } catch (parseError) {
      console.error("Failed to parse AI action items JSON string:", parseError);
      // Fallback mechanism: Wraps raw unparsed output safely as a single item string
      actionItemsArray = [{ task: rawActionItemsResponse }];
    }

    // Double check that it has normalized into an iterable array structure
    if (!Array.isArray(actionItemsArray)) {
      actionItemsArray = [actionItemsArray];
    }

    // 4. Transform data structures into explicit MERN/Mongoose relational schemas
const formattedActionItems = actionItemsArray.map((item: any) => ({
  task:
    typeof item === "string"
      ? item
      : item.task || item.action || "Unspecified Task",

  assignee:
    item.assignee ||
    item.owner ||
    item.person ||
    null,

  status: "pending" as "pending" | "completed",
}));

    // 5. Save structured tasks safely to the pre-loaded document
    meeting.actionItems = formattedActionItems;
    await meeting.save();

    res.status(200).json({
      success: true,
      actionItems: meeting.actionItems,
      meetingId: meeting._id,
    });
  } catch (error) {
    console.error("Action Items Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate and save action items",
    });
  }
};

const processMeetingAI = async (
  req: AuthenticatedMeetingRequest,
  res: Response
): Promise<void> => {
  try {
    const meeting = req.meeting;

    if (!meeting) {
      res.status(404).json({
        success: false,
        message: "Meeting document context missing",
      });
      return;
    }

const transcript =
  meeting.transcript || []

const aiInput = buildMeetingContext(
  transcript,
  meeting.chats
)

if (
  transcript.length === 0 &&
  meeting.chats.length === 0
){
  res.status(400).json({
    success: false,
    message:
      "No transcript or chat data found",
  });
  return;
}

const summary =
  await generateSummary(aiInput);

const rawActionItemsResponse =
  await generateActionItems(aiInput);

const rawDecisionsResponse =
  await generateKeyDecisions(aiInput);

    let actionItemsArray: any[] = [];

    try {
      actionItemsArray =
        typeof rawActionItemsResponse === "string"
          ? JSON.parse(rawActionItemsResponse)
          : rawActionItemsResponse;
    } catch {
      actionItemsArray = [];
    }
    
    let decisionsArray: string[] = [];

      try {
        decisionsArray =
          typeof rawDecisionsResponse === "string"
            ? JSON.parse(rawDecisionsResponse)
            : rawDecisionsResponse;
      } catch {
        decisionsArray = [];
      }

      if (!Array.isArray(decisionsArray)) {
        decisionsArray = [];
      }

    const formattedActionItems =
      actionItemsArray.map((item: any) => ({
        task:
          typeof item === "string"
            ? item
            : item.task || "Unspecified Task",

        assignee:
          item.assignee || "Unassigned",

        status: "pending" as "pending" | "completed",
      }));

    meeting.summary = summary;
    meeting.actionItems = formattedActionItems;
    meeting.keyDecisions = decisionsArray;

    await meeting.save();

    res.status(200).json({
      success: true,
      meetingId: meeting._id,
      summary,
      actionItems: formattedActionItems,
      keyDecisions: decisionsArray,
    });
  } catch (error) {
    console.error("Process AI Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process AI meeting data",
    });
  }
};
export {
  generateMeetingSummary,
  generateMeetingActionItems,
  processMeetingAI,
};