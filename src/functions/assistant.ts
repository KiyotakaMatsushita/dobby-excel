import { defaultSystemPrompt } from "./core/prompt/prompt_templates";
import { genericGPT } from "./gpt";

/**
 * Assistant GPT
 * @customFunction
 * @param {userPrompt} OpenAI user prompt.
 * @param [conversationHistory] a 2D range of user and assistant conversations.
 * @param [model] OpenAI model name.
 * @param [maxTokens] OpenAI maxTokens parameter.
 * @param [temperature] OpenAI temperature parameter.
 * @return {Promise<string>} OpenAI response.
 */
export async function assistantGPT(
  userPrompt: string,
  conversationHistory?: string[][],
  model?: string,
  maxTokens?: number,
  temperature?: number
): Promise<string> {
  return genericGPT(
    userPrompt,
    defaultSystemPrompt,
    conversationHistory || [],
    model || "gpt-4-0613",
    maxTokens || 1000,
    temperature || 0
  );
}
