import Meeting from "../../models/Meeting"

import { generateSummary } from "./summary.service"
import { generateActionItems } from "./actionItem.service"
import { generateKeyDecisions } from "./decision.service"

import { buildMeetingContext } from "../../utils/transcript.util"

export const processMeetingAI = async (
  meetingId: string
) => {
  const meeting = await Meeting.findById(meetingId)

  if (!meeting) {
    throw new Error("Meeting not found")
  }

  const transcript = meeting.transcript || []
  const chats = meeting.chats || []

  const aiInput = buildMeetingContext(
    transcript,
    chats
  )

  if (!aiInput) {
    console.log("No transcript/chat found. Skipping AI.")

    meeting.aiGenerated = false

    await meeting.save()

    return meeting
  }

  const [
    summary,
    actionItemsResponse,
    decisionsResponse,
  ] = await Promise.all([
    generateSummary(aiInput),
    generateActionItems(aiInput),
    generateKeyDecisions(aiInput),
  ])

  let actionItems = []

  try {
    actionItems =
      typeof actionItemsResponse === "string"
        ? JSON.parse(actionItemsResponse)
        : actionItemsResponse
  } catch {
    actionItems = []
  }

  if (!Array.isArray(actionItems)) {
    actionItems = []
  }

  const formattedActionItems =
    actionItems.map((item: any) => ({
      task:
        typeof item === "string"
          ? item
          : item.task || "Unspecified Task",

      assignee:
        item.assignee ||
        item.owner ||
        item.person ||
        "",

      status: "pending" as const,
    }))

  let keyDecisions: string[] = []

  try {
    keyDecisions =
      typeof decisionsResponse === "string"
        ? JSON.parse(decisionsResponse)
        : decisionsResponse
  } catch {
    keyDecisions = []
  }

  if (!Array.isArray(keyDecisions)) {
    keyDecisions = []
  }

  meeting.summary = summary

  meeting.actionItems =
    formattedActionItems

  meeting.keyDecisions =
    keyDecisions

  meeting.aiGenerated = true

  meeting.aiGeneratedAt = new Date()

  await meeting.save()

  return meeting
}