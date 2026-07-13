export type ChatGptCompanionConfig = {
  companionUrl: string;
  messageLimit: number;
  messageTextLimit: number;
  promptLengthLimit: number;
};

export const defaultChatGptCompanionConfig: ChatGptCompanionConfig = {
  companionUrl: "https://chatgpt.com/",
  messageLimit: 12,
  messageTextLimit: 1200,
  promptLengthLimit: 8000,
};

export function resolveChatGptCompanionConfig(
  env: Record<string, string | undefined> = {},
): ChatGptCompanionConfig {
  return {
    companionUrl:
      env.VITE_CLARA_CHATGPT_COMPANION_URL ??
      defaultChatGptCompanionConfig.companionUrl,
    messageLimit: positiveInt(
      env.VITE_CLARA_CHATGPT_CONTEXT_MESSAGE_LIMIT,
      defaultChatGptCompanionConfig.messageLimit,
    ),
    messageTextLimit: positiveInt(
      env.VITE_CLARA_CHATGPT_CONTEXT_TEXT_LIMIT,
      defaultChatGptCompanionConfig.messageTextLimit,
    ),
    promptLengthLimit: positiveInt(
      env.VITE_CLARA_CHATGPT_CONTEXT_PROMPT_LIMIT,
      defaultChatGptCompanionConfig.promptLengthLimit,
    ),
  };
}

function positiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
