/* global CustomFunctions */
/* global console */
import { convertStringToUnionType } from "../util/typeConverter";
import { getAPIKey } from "../util/key";
import { makeConversationContents } from "./core/ChatCompletion/message";
import { getOpenAIModelNames, fetchOpenAICompletion, fetchOpenAIStreamCompletion } from "./core/provider/openai";

/**
 * OpenAI GPT stream chat with system and assistant.
 * @customfunction
 * @param {systemPrompt}  OpenAI system prompt.
 * @param {userPrompt} OpenAI user prompt.
 * @param [conversationHistory] a 2D range of user and assistant conversations.
 * @param [model] OpenAI model name.
 * @param [maxTokens] OpenAI maxTokens parameter.
 * @param [temperature] OpenAI temperature parameter.
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
  genericStreamGPT(
    userPrompt || "",
    systemPrompt,
    conversationHistory || [],
    model || "gpt-4-0613",
    maxTokens || 1000,
    temperature || 0,
    invocation
  );
}

/**
 * OpenAI GPT chat with range of prompts.
 * @customFunction
 * @param {systemPrompt}  OpenAI system prompt.
 * @param {userPrompt} OpenAI user prompt.
 * @param [conversationHistory] a 2D range of user and assistant conversations.
 * @param [model] OpenAI model name.
 * @param [maxTokens] OpenAI maxTokens parameter.
 * @param [temperature] OpenAI temperature parameter.
 * @return {Promise<string>} OpenAI response.
 */
export async function GPT(
  systemPrompt: string,
  userPrompt?: string,
  conversationHistory?: string[][],
  model?: string,
  maxTokens?: number,
  temperature?: number
): Promise<string> {
  return genericGPT(
    userPrompt || "",
    systemPrompt,
    conversationHistory || [],
    model || "gpt-4-0613",
    maxTokens || 1000,
    temperature || 0
  );
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

    console.log(getOpenAIModelNames());
    // const m = convertStringToUnionType(model, getOpenAIModelNames());

    // if (!m) {
    //   let error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, "Invalid model name");
    //   console.error(error);
    //   throw error;
    // }

    const res = await fetchOpenAICompletion({
      model,
      maxTokens,
      temperature,
      apiKey,
      systemContent: systemPrompt,
      userContent: userPrompt,
      conversationContents: makeConversationContents(conversationHistory),
    });

    return res.choices[0].message.content;
  } catch (error) {
    console.error(error);
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
  console.log(getOpenAIModelNames());
  // const m = convertStringToUnionType(model, getOpenAIModelNames());

  // if (!m) {
  //   let error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, "Invalid model name");
  //   throw error;
  // }

  getAPIKey().then(async (apiKey) => {
    const generator = fetchOpenAIStreamCompletion({
      model,
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
