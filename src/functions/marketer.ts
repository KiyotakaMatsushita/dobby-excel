/* global CustomFunctions */
import { genericGPT, genericStreamGPT } from "./gpt";

/**
 * Marketer GPT
 * @customfunction
 * @param {userPrompt} OpenAI user prompt.
 * @param [conversationHistory] a 2D range of user and assistant conversations.
 * @param [model] OpenAI model name.
 * @param [maxTokens] OpenAI maxTokens parameter.
 * @param [temperature] OpenAI temperature parameter.
 * @return {Promise<string>} OpenAI response.
 */
export async function marketerGPT(
  userPrompt: string,
  conversationHistory?: string[][],
  model?: string,
  maxTokens?: number,
  temperature?: number
): Promise<string> {
  return genericGPT(
    userPrompt,
    "あなたはプロのマーケターです。",
    conversationHistory || [],
    model || "gpt-4-0613",
    maxTokens || 1000,
    temperature || 0
  );
}

/**
 * OpenAI GPT stream chat with system and assistant.
 * @customfunction
 * @param userPrompt  Last OpenAI user prompt.
 * @param [conversationHistory] a 2D range of user and assistant conversations.
 * @param [model]  OpenAI model name.
 * @param [maxTokens]  OpenAI maxTokens parameter.
 * @param [temperature]  OpenAI temperature parameter.
 * @param {CustomFunctions.StreamingInvocation<string>} invocation Streaming invocation parameter.
 */
export function marketerStreamGPT1(
  userPrompt: string,
  conversationHistory: string[][],
  model: string,
  maxTokens: number,
  temperature: number,
  invocation: CustomFunctions.StreamingInvocation<string>
): void {
  genericStreamGPT(
    userPrompt,
    "あなたはプロのマーケターです。",
    conversationHistory || [],
    model || "gpt-4-0613",
    maxTokens || 1000,
    temperature || 0,
    invocation
  );
}

/**
 * Analyzer GPT
 * @customfunction
 * @param {range} 2d array of data.
 * @param [conversationHistory] a 2D range of user and assistant conversations.
 * @param [model] OpenAI model name.
 * @param [maxTokens] OpenAI maxTokens parameter.
 * @param [temperature] OpenAI temperature parameter.
 * @return {Promise<string>} OpenAI response.
 */
export async function analyzer(
  range: string[][],
  conversationHistory?: string[][],
  model?: string,
  maxTokens?: number,
  temperature?: number
): Promise<string> {
  const dataString = range.map((row) => row.join(",")).join("\n");

  const userPrompt = `
  下記のデータがあるとき、どのようなマーケティング施策を行いますか？
  #{data}:
  ${dataString}
  `;

  return genericGPT(
    userPrompt,
    "あなたはプロのマーケターです。",
    conversationHistory || [],
    model || "gpt-4-0613",
    maxTokens || 1000,
    temperature || 0
  );
}
