import { genericGPT } from "./gpt";

/**
 * Marketer GPT
 * @customfunction
 */
export async function marketerGPT(
  userPrompt: string,
  systemPrompt?: string,
  conversationHistory?: string[][],
  model?: string,
  maxTokens?: number,
  temperature?: number
): Promise<string> {
  return genericGPT(
    userPrompt,
    systemPrompt || "あなたはプロのマーケターです。",
    conversationHistory || [],
    model || "gpt-4-0613",
    maxTokens || 1000,
    temperature || 0
  );
}
