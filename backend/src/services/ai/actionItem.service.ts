import { HfInference } from "@huggingface/inference"
import { ACTION_ITEM_PROMPT } from "./prompt.service"

if (!process.env.HF_API_KEY) {
  console.warn("WARNING: HF_API_KEY is not defined in your environment variables. AI features will fail.");
}

const client = new HfInference(process.env.HF_API_KEY)

const generateActionItems = async (transcript: string): Promise<string> => {
  try {
    const response = await client.chatCompletion({
      // Unified model choice for consistent prompt execution across your entire architecture
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        {
          role: "system",
          content: ACTION_ITEM_PROMPT,
        },
        {
      role: "user",
      content: `Meeting Transcript:\n\n${transcript}`,
    },
      ],
      max_tokens: 500,
      temperature: 0.1, // Lower temperature forces the model to stick closely to the JSON format rules
    });

      let content =
        response.choices?.[0]?.message?.content || "[]"

      content = content
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim()

      if (!content) {
        return "[]"
      }

      return content
  } catch (error) {
    console.error("Action Item Service Error:", error);
    // Return a safe fallback valid JSON string so that it doesn't crash the server loop
    return "[]";
  }
};

export { generateActionItems };