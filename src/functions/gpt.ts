/* global CustomFunctions */
import { convertStringToUnionType } from "../util/typeConverter";
import { getAPIKey } from "../util/key";
import { makeConversationContents } from "./core/ChatCompletion/message";
import { OPENAI_MODEL_NAMES, fetchOpenAICompletion, fetchOpenAIStreamCompletion } from "./core/provider/openai";

/**
 * OpenAI GPT stream chat with system and assistant.
 * @customfunction
 * @param systemPrompt  OpenAI system prompt.
 * @param userPrompt  Last OpenAI user prompt.
 * @param conversationHistory a 2D range of user and assistant conversations.
 * @param model  OpenAI model name.
 * @param maxTokens  OpenAI maxTokens parameter.
 * @param temperature  OpenAI temperature parameter.
 * @param {CustomFunctions.StreamingInvocation<string>} invocation Streaming invocation parameter.
 */
export function streamGPT(
  systemPrompt: string,
  userPrompt: string,
  conversationHistory: string[][],
  model: string,
  maxTokens: number,
  temperature: number,
  invocation: CustomFunctions.StreamingInvocation<string>
): void {
  const m = convertStringToUnionType(model, OPENAI_MODEL_NAMES);

  if (!m) {
    throw new Error("Invalid model name");
  }

  getAPIKey().then(async (apiKey) => {
    const generator = fetchOpenAIStreamCompletion({
      model: m,
      maxTokens,
      temperature,
      apiKey,
      systemContent: systemPrompt,
      userContent: userPrompt,
      conversationContents: makeConversationContents(conversationHistory),
    });
    let tokens = "";
    for await (const token of generator) {
      tokens += token;
      invocation.setResult(tokens);
    }
  });
}

/**
 * OpenAI GPT chat with range of prompts.
 * @customfunction
 * @param systemPrompt  OpenAI system prompt.
 * @param userPrompt  Last OpenAI user prompt.
 * @param conversationHistory a 2D range of user and assistant conversations.
 * @param model  OpenAI model name.
 * @param maxTokens  OpenAI maxTokens parameter.
 * @param temperature  OpenAI temperature parameter.
 */
export async function GPT(
  systemPrompt: string,
  userPrompt: string,
  conversationHistory: string[][],
  model: string,
  maxTokens: number,
  temperature: number
): Promise<string> {
  const apiKey = await getAPIKey();

  const m = convertStringToUnionType(model, OPENAI_MODEL_NAMES);

  if (!m) {
    throw new Error("Invalid model name");
  }

  const res = await fetchOpenAICompletion({
    model: m,
    maxTokens,
    temperature,
    apiKey,
    systemContent: systemPrompt,
    userContent: userPrompt,
    conversationContents: makeConversationContents(conversationHistory),
  });
  return res.choices[0].message.content;
}
export async function genericGPT(
  userPrompt: string,
  systemPrompt: string,
  conversationHistory: string[][],
  model: string,
  maxTokens: number,
  temperature: number
): Promise<string> {
  try {
    const apiKey = await getAPIKey();

    const m = convertStringToUnionType(model, OPENAI_MODEL_NAMES);

    if (!m) {
      let error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, "Invalid model name");
      throw error;
    }

    const res = await fetchOpenAICompletion({
      model: m,
      maxTokens,
      temperature,
      apiKey,
      systemContent: systemPrompt,
      userContent: userPrompt,
      conversationContents: makeConversationContents(conversationHistory),
    });

    return res.choices[0].message.content;
  } catch (error) {
    throw new CustomFunctions.Error(CustomFunctions.ErrorCode.notAvailable, error as string | undefined);
  }
}

export function genericStreamGPT(
  userPrompt: string,
  systemPrompt: string,
  conversationHistory: string[][],
  model: string,
  maxTokens: number,
  temperature: number,
  invocation: CustomFunctions.StreamingInvocation<string>
): void {
  const m = convertStringToUnionType(model, OPENAI_MODEL_NAMES);

  if (!m) {
    let error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, "Invalid model name");
    throw error;
  }

  getAPIKey().then(async (apiKey) => {
    const generator = fetchOpenAIStreamCompletion({
      model: m,
      maxTokens,
      temperature,
      apiKey,
      systemContent: systemPrompt,
      userContent: userPrompt,
      conversationContents: makeConversationContents(conversationHistory),
    });
    let tokens = "";
    for await (const token of generator) {
      tokens += token;
      invocation.setResult(tokens);
    }
  });
}
