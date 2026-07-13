import { defaultChatGptCompanionConfig } from "./chatgpt-companion-config";

const allowedHosts = new Set(["chatgpt.com", "chat.openai.com"]);

export function resolveChatGptCompanionUrl(input?: string): string {
  try {
    const url = new URL(input ?? defaultChatGptCompanionConfig.companionUrl);

    if (url.protocol !== "https:" || !allowedHosts.has(url.hostname)) {
      return defaultChatGptCompanionConfig.companionUrl;
    }

    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return defaultChatGptCompanionConfig.companionUrl;
  }
}
