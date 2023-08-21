/* global CustomFunctions, console */
import { getAPIKey } from "../util/key";
import { assistantMessage, userMessage } from "./core/ChatCompletion/message";
import {
  AIModelName,
  OpenAIConversation,
  fetchOpenAICompletion,
  fetchOpenAIStreamCompletion,
} from "./core/provider/openai";

/**
 * OpenAI GPT stream chat with system and assistant.
 * @customfunction
 * @param systemPrompt  OpenAI system prompt.
 * @param userPrompt  Last OpenAI user prompt.
 * @param historyConversations array of user and assistant conversations.
 * @param model  OpenAI model name.
 * @param maxTokens  OpenAI maxTokens parameter.
 * @param temperature  OpenAI temperature parameter.
 * @param {CustomFunctions.StreamingInvocation<string>} invocation Streaming invocation parameter.
 */
export function streamGPT(
  systemPrompt: string,
  userPrompt: string = "",
  historyConversations: HistoryConversations,
  model = AIModelName.GPT4_0613,
  maxTokens: number = 2000,
  temperature: number = 0,
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
      conversationContents: makeConversationContents(historyConversations),
    });
    let tokens = "";
    for await (const token of generator) {
      tokens += token;
      invocation.setResult(tokens);
    }
  });
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

/**
 * OpenAI GPT chat with range of prompts.
 * @customfunction
 * @param systemPrompt  OpenAI system prompt.
 * @param userPrompt  Last OpenAI user prompt.
 * @param historyConversations array of user and assistant conversations.
 * @param model  OpenAI model name.
 * @param maxTokens  OpenAI maxTokens parameter.
 * @param temperature  OpenAI temperature parameter.
 */
export async function GPT(
  systemPrompt: string,
  userPrompt: string = "",
  historyConversations: HistoryConversations,
  model = AIModelName.GPT4_0613,
  maxTokens: number = 2000,
  temperature: number = 0
): Promise<string> {
  const apiKey = await getAPIKey();
  const res = await fetchOpenAICompletion({
    model,
    maxTokens,
    temperature,
    apiKey,
    systemContent: systemPrompt,
    userContent: userPrompt,
    conversationContents: makeConversationContents(historyConversations),
  });
  return res.choices[0].message.content;
}

const makeConversationContents = (historyConversations): OpenAIConversation[] => {
  const conversationContents: OpenAIConversation[] = [];
  for (const convesation of historyConversations) {
    conversationContents.push([userMessage(convesation[0]), assistantMessage(convesation[1])]);
  }
  return conversationContents;
};

type HistoryConversations = string[][];
