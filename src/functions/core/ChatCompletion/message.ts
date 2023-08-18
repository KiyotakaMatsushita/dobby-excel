import { OpenAIChatMessage } from "../provider/openai";

export const systemMessage = (content: string): OpenAIChatMessage => ({
  role: "system",
  content,
});

export const userMessage = (content: string): OpenAIChatMessage => ({
  role: "user",
  content,
});

export const functionMessage = (name: string, content: string): OpenAIChatMessage => ({
  name,
  role: "function",
  content,
});
