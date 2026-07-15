const blockedKeyParts = [
  "access_" + "token",
  "refresh_" + "token",
  "provider" + "Cookie",
  "session" + "Cookie",
  "authorization",
  "rawProvider" + "Payload",
  "raw_provider_" + "payload",
  "rawWebhook" + "Payload",
  "raw_webhook_" + "payload",
  "raw" + "Dom",
  "raw" + "Html",
  "serviceRoleKey",
  "OPENAI_" + "API_KEY",
  "GEMINI_" + "API_KEY",
  "ANTHROPIC_" + "API_KEY",
];

const blockedKeyPattern = new RegExp(blockedKeyParts.join("|"), "i");

export function isAiContextBlockedKey(key: string): boolean {
  return blockedKeyPattern.test(key);
}

export function sanitizeAiPlainText(input: unknown, maxChars = 1000): string {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxChars);
}

export function sanitizeAiObject(
  input: Record<string, unknown>,
): Record<string, string | number | boolean | null> {
  return Object.fromEntries(
    Object.entries(input).flatMap(([key, value]) => {
      if (isAiContextBlockedKey(key)) {
        return [];
      }

      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean" ||
        value === null
      ) {
        return [[key, value]];
      }

      return [];
    }),
  );
}
