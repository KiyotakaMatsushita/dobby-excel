/* global CustomFunctions */
import { getAPIKey } from "../util/key";
import { AIModelName, fetchOpenAICompletion, fetchOpenAIStreamCompletion } from "./core/provider/openai";

/**
 * Gets the star count for a given Github organization or user and repository.
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
 * Gets the star count for a given Github organization or user and repository.
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
 * Gets the star count for a given Github organization or user and repository.
 * @customfunction
 * @param model  OpenAI model name.
 * @param systemPrompt  OpenAI system prompt.
 * @param userPrompt  OpenAI user prompt.
 * @param maxTokens  OpenAI maxTokens parameter.
 * @param temperature  OpenAI temperature parameter.
 * @param {CustomFunctions.StreamingInvocation<string>} invocation Streaming invocation parameter.
 */
export function streamGPT(
  model,
  systemPrompt: string,
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
 * Gets the star count for a given Github organization or user and repository.
 * @customfunction
 * @param model  OpenAI model name.
 * @param systemPrompt  OpenAI system prompt.
 * @param userPrompt  OpenAI user prompt.
 * @param maxTokens  OpenAI maxTokens parameter.
 * @param temperature  OpenAI temperature parameter.
 */
export async function GPT(
  model,
  systemPrompt: string,
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
    userContent: userPrompt,
  });
  return res.choices[0].message.content;
}
