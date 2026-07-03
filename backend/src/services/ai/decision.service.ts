import { HfInference } from "@huggingface/inference"
import { DECISION_PROMPT } from "./prompt.service"

if (!process.env.HF_API_KEY) {
  console.warn(
    "WARNING: HF_API_KEY is not defined in your environment variables. AI features will fail."
  )
}

const client = new HfInference(process.env.HF_API_KEY)

const generateKeyDecisions = async (
  transcript: string
): Promise<string> => {
  try {
    const response = await client.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",

      messages: [
        {
          role: "system",
          content: DECISION_PROMPT,
        },
        {
          role: "user",
          content: `Meeting Transcript:\n\n${transcript}`,
        },
      ],

      max_tokens: 500,
      temperature: 0.1,
    })

    let content: string = String(
      response.choices?.[0]?.message?.content ?? "[]"
    )

    content = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim()

    if (!content) {
      return "[]"
    }

    return content
  } catch (error) {
    console.error("Decision Service Error:", error)
    return "[]"
  }
}

export { generateKeyDecisions }