const blockedTerms = [
  ["access", "token"].join("_"),
  ["refresh", "token"].join("_"),
  "token",
  "cookie",
  "session",
  "authorization",
  "auth header",
  "api key",
  "secret",
  "password",
  ["raw", "provider", "payload"].join(""),
  ["raw", "provider", "payload"].join("_"),
  ["raw", "webhook", "payload"].join(""),
  ["raw", "webhook", "payload"].join("_"),
  ["raw", "audit", "metadata"].join(""),
  ["raw", "audit", "metadata"].join("_"),
  ["raw", "customer", "message"].join(""),
  ["raw", "customer", "message"].join("_"),
  ["raw", "dom"].join(""),
  ["raw", "html"].join(""),
  ["raw", "prompt"].join(""),
  ["provider", "cookie"].join(""),
  ["session", "cookie"].join(""),
  ["customer", "message", "body"].join(""),
] as const;

export function findSensitiveAnalyticsRequestTerm(
  value: unknown,
): string | null {
  const text = JSON.stringify(value ?? {}).toLowerCase();

  return blockedTerms.find((term) => text.includes(term.toLowerCase())) ?? null;
}

export function isSensitiveAnalyticsRequest(value: unknown): boolean {
  return findSensitiveAnalyticsRequestTerm(value) !== null;
}
