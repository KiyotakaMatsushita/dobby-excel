/* global clearInterval, console, CustomFunctions, setInterval */
import { OPENAI_API_KEY } from "../config";
import { AIModelName, fetchOpenAICompletion, fetchOpenAIStreamCompletion } from "./core/provider/openai";
/**
 * Adds two numbers.
 * @customfunction
 * @param first First number
 * @param second Second number
 * @returns The sum of the two numbers.
 */
export function add(first: number, second: number): number {
  return first + second;
}

/**
 * Displays the current time once a second.
 * @customfunction
 * @param invocation Custom function handler
 */
export function clock(invocation: CustomFunctions.StreamingInvocation<string>): void {
  const timer = setInterval(() => {
    const time = currentTime();
    invocation.setResult(time);
  }, 1000);

  invocation.onCanceled = () => {
    clearInterval(timer);
  };
}

/**
 * Returns the current time.
 * @returns String with the current time formatted for the current locale.
 */
export function currentTime(): string {
  return new Date().toLocaleTimeString();
}

/**
 * Increments a value once a second.
 * @customfunction
 * @param incrementBy Amount to increment
 * @param invocation Custom function handler
 */
export function increment(incrementBy: number, invocation: CustomFunctions.StreamingInvocation<number>): void {
  let result = 0;
  const timer = setInterval(() => {
    result += incrementBy;
    invocation.setResult(result);
  }, 1000);

  invocation.onCanceled = () => {
    clearInterval(timer);
  };
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
 * Gets the star count for a given Github organization or user and repository.
 * @customfunction
 * @param userName string name of organization or user.
 * @param repoName string name of the repository.
 * @return number of stars.
 */
export async function getStarCount(userName: string, repoName: string): Promise<number> {
  const url = "https://api.github.com/repos/" + userName + "/" + repoName;

  let xhttp = new XMLHttpRequest();

  return new Promise(function (resolve, reject) {
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState !== 4) return;

      if (xhttp.status == 200) {
        resolve(JSON.parse(xhttp.responseText).watchers_count);
      } else {
        reject({
          status: xhttp.status,

          statusText: xhttp.statusText,
        });
      }
    };

    xhttp.open("GET", url, true);

    xhttp.send();
  });
}

/**
 * Gets the star count for a given Github organization or user and repository.
 * @customfunction
 * @param prompt string name of organization or user.
 * @return openai response.
 */
export async function chat(prompt): Promise<string> {
  const res = await fetchOpenAICompletion({
    apiKey: OPENAI_API_KEY,
    userContent: prompt,
    // maxTokens: 2000,
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
export function streamChat(prompt, invocation: CustomFunctions.StreamingInvocation<string>): void {
  fetchOpenAIStreamCompletion({
    apiKey: OPENAI_API_KEY,
    userContent: prompt,
    model: AIModelName.GPT35TURBO,
    invocation,
  });
}
