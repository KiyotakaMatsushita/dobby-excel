import { systemMessage, userMessage } from "../ChatCompletion/message";
import { defaultSystemPrompt } from "../prompt";
export interface OpenAIChatMessage {
  role: string;
  name?: string;
  content: string;
}

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
  userContent,
}: // maxTokens = 2000,
// temparature = 0,
{
  apiKey: string;
  model?: AIModelName;
  systemContent?: string;
  userContent: string;
  // maxTokens?: number;
  // temparature?: number;
}): Promise<OpenAIResponse> {
  if (!apiKey) {
    throw new Error("OpenAI API key is not set");
  }
  if (!userContent) {
    throw new Error("User content is not set");
  }
  const endpoint = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const body = JSON.stringify({
    model,
    messages: [systemMessage(systemContent), userMessage(userContent)],
    // maxTokens,
    // temparature,
  });

  const response = await chat({ endpoint, headers, body });

  if (!response.ok) {
    throw new Error(`OpenAI API request failed with status: ${response.status}`);
  }

  return response.json();
}

async function chat({ endpoint, headers, body }: { endpoint: string; headers: any; body: string }): Promise<Response> {
  // eslint-disable-next-line no-undef
  return await fetch(endpoint, {
    method: "POST",
    headers: headers,
    body: body,
  });
}

export async function fetchOpenAIStreamCompletion({
  apiKey,
  model = AIModelName.GPT4_0613,
  systemContent = defaultSystemPrompt,
  userContent,
  invocation,
}: {
  apiKey: string;
  model?: AIModelName;
  systemContent?: string;
  userContent: string;
  invocation: CustomFunctions.StreamingInvocation<string>;
}) {
  if (!apiKey) {
    throw new Error("OpenAI API key is not set");
  }
  if (!userContent) {
    throw new Error("User content is not set");
  }
  const endpoint = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const body = JSON.stringify({
    model,
    messages: [systemMessage(systemContent), userMessage(userContent)],
    stream: true,
  });

  const response = await fetch(endpoint, {
    method: "POST",
    headers: headers,
    body: body,
  });

  const reader = response.body.getReader();

  let tokens = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    let chunkData = new TextDecoder().decode(value);
    const lines = chunkData.split("\n").filter((line: string) => line.trim().startsWith("data: "));
    for (const line of lines) {
      const message = line.replace(/^data: /, "");
      if (message === "[DONE]") {
        return;
      }
      const json = JSON.parse(message);
      const token: string | undefined = json.choices[0].delta.content;
      if (token) {
        tokens += token;
        invocation.setResult(tokens); // Update the cell with the accumulated content
      }
    }
  }
}
