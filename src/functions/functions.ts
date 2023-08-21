/* global CustomFunctions, console */
import { getAPIKey } from "../util/key";
import { AIModelName, fetchOpenAICompletion, fetchOpenAIStreamCompletion } from "./core/provider/openai";

/**
 * OpenAI GPT chat with user.
 * @customfunction
 * @param prompt string name of organization or user.
 * @return openai response.
 */
export async function chat(prompt: string): Promise<string> {
  const apiKey = await getAPIKey();
  const res = await fetchOpenAICompletion({
    apiKey,
    userContent: prompt,
    model: AIModelName.GPT4_0613,
  });
  return res.choices[0].message.content;
}

/**
 * OpenAI GPT stream chat with user.
 * @customfunction
 * @param prompt string name of organization or user.
 * @param {CustomFunctions.StreamingInvocation<string>} invocation Streaming invocation parameter.
 */

export function streamChat(prompt: string, invocation: CustomFunctions.StreamingInvocation<string>): void {
  getAPIKey().then(async (apiKey) => {
    const generator = fetchOpenAIStreamCompletion({
      apiKey,
      userContent: prompt,
      model: AIModelName.GPT4_0613,
    });
    let tokens = "";
    for await (const token of generator) {
      tokens += token;
      invocation.setResult(tokens);
    }
  });
}

/**
 * OpenAI GPT stream chat with system and assistant.
 * @customfunction
 * @param model  OpenAI model name.
 * @param systemPrompt  OpenAI system prompt.
 * @param assistantPrompt OpenAI assistant prompt.
 * @param userPrompt  OpenAI user prompt.
 * @param maxTokens  OpenAI maxTokens parameter.
 * @param temperature  OpenAI temperature parameter.
 * @param {CustomFunctions.StreamingInvocation<string>} invocation Streaming invocation parameter.
 */
export function streamGPT(
  model,
  systemPrompt: string,
  assistantPrompt: string,
  userPrompt: string,
  maxTokens: number,
  temperature: number,
  invocation: CustomFunctions.StreamingInvocation<string>
): void {
  getAPIKey().then(async (apiKey) => {
    const generator = fetchOpenAIStreamCompletion({
      model,
      maxTokens,
      temperature,
      apiKey,
      systemContent: systemPrompt,
      assistantContent: assistantPrompt,
      userContent: userPrompt,
    });
    let tokens = "";
    for await (const token of generator) {
      tokens += token;
      invocation.setResult(tokens);
    }
  });
}

/**
 * OpenAI GPT chat.
 * @customfunction
 * @param model  OpenAI model name.
 * @param systemPrompt  OpenAI system prompt.
 * @param assistantPrompt OpenAI assistant prompt.
 * @param userPrompt  OpenAI user prompt.
 * @param maxTokens  OpenAI maxTokens parameter.
 * @param temperature  OpenAI temperature parameter.
 */
export async function GPT(
  model,
  systemPrompt: string,
  assistantPrompt: string,
  userPrompt: string,
  maxTokens: number,
  temperature: number
): Promise<string> {
  const apiKey = await getAPIKey();
  const res = await fetchOpenAICompletion({
    model,
    maxTokens,
    temperature,
    apiKey,
    systemContent: systemPrompt,
    assistantContent: assistantPrompt,
    userContent: userPrompt,
  });
  return res.choices[0].message.content;
}

/**
 * Writes a message to console.log().
 * @customfunction LOG
 * @param message String to write.
 * @returns String to write.
 */
export function logMessage(message: string): string {
  console.log(message);

  return message;
}

/**
 * Writes multiple message to console.log().
 * @customfunction
 * @param range A 2D range from Excel.
 */
export function logRange(range: string[][]): void {
  console.log(range);
}
