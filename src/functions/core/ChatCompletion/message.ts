import { OpenAIAssistantMessage, OpenAIChatMessage, OpenAIUserMessage } from "../provider/openai";

export const systemMessage = (content: string): OpenAIChatMessage => ({
  role: "system",
  content,
});

export const userMessage = (content: string): OpenAIUserMessage => ({
  role: "user",
  content,
});

export const functionMessage = (name: string, content: string): OpenAIChatMessage => ({
  name,
  role: "function",
  content,
});

export const assistantMessage = (content: string): OpenAIAssistantMessage => ({
  role: "assistant",
  content,
});
