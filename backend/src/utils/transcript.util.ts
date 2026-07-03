export const buildMeetingContext = (
  transcript:
    | {
        speaker: string
        text: string
        timestamp: Date
      }[]
    | undefined,
  chats: any[]
) => {
  const transcriptText = (transcript || [])
    .filter(
      (item) =>
        item.text &&
        item.text.trim().length > 0
    )
    .map(
      (item) =>
        `${item.speaker}: ${item.text}`
    )
    .join("\n")

  const chatText = (chats || [])
    .filter(
      (chat) =>
        chat.message &&
        chat.message.trim().length > 0
    )
    .map(
      (chat) =>
        `${chat.name}: ${chat.message}`
    )
    .join("\n")

  let context = ""

  if (transcriptText) {
    context +=
      "========== MEETING TRANSCRIPT ==========\n\n"

    context += transcriptText
  }

  if (chatText) {
    if (context) {
      context += "\n\n"
    }

    context +=
      "========== MEETING CHAT ==========\n\n"

    context += chatText
  }

  return context.trim()
}