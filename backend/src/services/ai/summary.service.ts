import { HfInference } from "@huggingface/inference"
import { SUMMARY_PROMPT } from "./prompt.service"

// Production Safeguard: Alert early during backend startup if the API key is missing
if (!process.env.HF_API_KEY) {
  console.warn("WARNING: HF_API_KEY is not defined in your environment variables. AI features will fail.");
}

const client = new HfInference(process.env.HF_API_KEY)

const generateSummary = async (transcript: string): Promise<string> => {
  try {
    const response = await client.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
  {
      role: "system",
      content: SUMMARY_PROMPT,
    },
    {
      role: "user",
      content: `Meeting Transcript:\n\n${transcript}`,
    },
      ],
      max_tokens: 500,
      // Optional Production tip: Adding temperature controls creativity. 
      // 0.3 ensures consistent, fact-based summaries from the transcript.
      temperature: 0.3, 
    });

    const summary =
      response.choices?.[0]?.message?.content?.trim();

    if (!summary) {
      throw new Error("Empty summary returned by model");
    }

    return summary;
  } catch (error: any) {
  console.error("Summary Service Error:", error);
  console.error("Error Name:", error?.name);
  console.error("Error Message:", error?.message);
  console.error("Error Cause:", error?.cause);
    throw new Error("AI service was unable to generate meeting summary. Please try again.");
  }
};

export { generateSummary };