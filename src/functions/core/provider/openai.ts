/* global AsyncGenerator, fetch */

import { systemMessage, userMessage } from "../ChatCompletion/message";
import { defaultSystemPrompt } from "../prompt/prompt_templates";
export interface OpenAIChatMessage {
  role: string;
  name?: string;
  content: string;
}

export interface OpenAIUserMessage {
  role: "user";
  content: string;
}

export interface OpenAIAssistantMessage {
  role: "assistant";
  content: string;
}

export type OpenAIConversation = [OpenAIUserMessage, OpenAIAssistantMessage];

export enum AIModelName {
  GPT35TURBO = "gpt-3.5-turbo",
  GPT4_0613 = "gpt-4-0613",
  GPT4_0314 = "gpt-4-0314",
  GPT4 = "gpt-4",
}

export interface OpenAIChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    message: OpenAIChatMessage;
    finish_reason: string;
    index: number;
  }[];
}

// 定義: OpenAIのレスポンス型
interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// 関数: OpenAIのchatCompletionを実行
export async function fetchOpenAICompletion({
  apiKey,
  model = AIModelName.GPT4_0613,
  systemContent = defaultSystemPrompt,
  userContent = "",
  conversationContents = [],
  maxTokens = 4000,
  temperature = 0,
}: {
  apiKey: string;
  model?: AIModelName;
  systemContent?: string;
  userContent?: string;
  conversationContents?: OpenAIConversation[];
  maxTokens?: number;
  temperature?: number;
}): Promise<OpenAIResponse> {
  if (!apiKey) {
    throw new Error("OpenAI API key is not set");
  }
  const endpoint = "https://api.openai.com/v1/chat/completions";

  const headers = make_headers(apiKey);

  const messages: OpenAIChatMessage[] = [];
  messages.push(systemMessage(systemContent));

  for (const conversation of conversationContents) {
    for (const message of conversation) {
      messages.push(message);
    }
  }

  if (userContent) {
    messages.push(userMessage(userContent));
  }

  const body = make_body({
    model,
    messages,
    maxTokens,
    temperature,
    stream: false,
  });

  const response = await make_request({ endpoint, headers, body });

  if (!response.ok) {
    throw new Error(`OpenAI API request failed with status: ${response.status}`);
  }

  return response.json();
}

export async function* fetchOpenAIStreamCompletion({
  apiKey,
  model = AIModelName.GPT4_0613,
  systemContent = defaultSystemPrompt,
  userContent = "",
  conversationContents = [],
  maxTokens = 4000,
  temperature = 0,
}: {
  apiKey: string;
  model?: AIModelName;
  systemContent?: string;
  userContent?: string;
  conversationContents?: OpenAIConversation[];
  maxTokens?: number;
  temperature?: number;
}): AsyncGenerator<string> {
  if (!apiKey) {
    throw new Error("OpenAI API key is not set");
  }

  const endpoint = "https://api.openai.com/v1/chat/completions";

  const headers = make_headers(apiKey);

  const messages: OpenAIChatMessage[] = [];
  messages.push(systemMessage(systemContent));

  for (const conversation of conversationContents) {
    for (const message of conversation) {
      messages.push(message);
    }
  }

  if (userContent) {
    messages.push(userMessage(userContent));
  }

  const body = make_body({
    model,
    messages,
    maxTokens,
    temperature,
    stream: true,
  });

  const response = await make_request({ endpoint, headers, body });

  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error("Response body is undefined");
  }

  let isDone = false;
  while (!isDone) {
    const { done, value } = await reader.read();
    if (done) {
      isDone = done;
      reader.releaseLock();
    }
    let chunkData = new TextDecoder("utf-8").decode(value);
    const lines = chunkData.split("\n").filter((line: string) => line.trim().startsWith("data: "));
    for (const line of lines) {
      const message = line.replace(/^data: /, "");
      if (message === "[DONE]") {
        return;
      }
      const json = JSON.parse(message);
      const token: string | undefined = json.choices[0].delta.content;
      if (token) {
        yield token;
      }
    }
  }
}

function make_request({
  endpoint,
  headers,
  body,
}: {
  endpoint: string;
  headers: any;
  body: string;
}): Promise<Response> {
  return fetch(endpoint, {
    method: "POST",
    headers,
    body,
  });
}

function make_headers(apiKey: string): any {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
}

function make_body({
  model,
  messages,
  maxTokens = 2000,
  temperature = 0,
  stream,
}: {
  model: AIModelName;
  messages: OpenAIChatMessage[];
  maxTokens?: number;
  temperature?: number;
  stream: boolean;
}): string {
  return JSON.stringify({
    model,
    messages,
    max_tokens: maxTokens,
    temperature,
    stream,
  });
}
