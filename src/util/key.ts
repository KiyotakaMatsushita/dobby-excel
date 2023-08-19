/* global OfficeRuntime */

export async function setAPIKey(apiKey: string): Promise<void> {
  await (OfficeRuntime as any).storage.setItem("apiKey", apiKey);
}

export async function getAPIKey(): Promise<string> {
  const apiKey = await (OfficeRuntime as any).storage.getItem("apiKey");
  return apiKey;
}
