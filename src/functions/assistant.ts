import { defaultSystemPrompt } from "./core/prompt/prompt_templates";
import { genericGPT } from "./gpt";

/**
 * Assistant GPT
 * @customFunction
 * @param {userPrompt} OpenAI user prompt.
 * @return {Promise<string>} OpenAI response.
 */
export async function assistantGPT(
  userPrompt: string,
  systemPrompt?: string,
  conversationHistory?: string[][],
  model?: string,
  maxTokens?: number,
  temperature?: number
): Promise<string> {
  return genericGPT(
    userPrompt,
    systemPrompt || defaultSystemPrompt,
    conversationHistory || [],
    model || "gpt-4-0613",
    maxTokens || 1000,
    temperature || 0
  );
}
