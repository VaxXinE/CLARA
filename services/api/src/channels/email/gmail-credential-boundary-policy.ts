const forbiddenCredentialKeys = new Set([
  ["access", "token"].join("_"),
  ["refresh", "token"].join("_"),
  "authorization",
  ["client", "secret"].join("_"),
  ["raw", "provider", "payload"].join("_"),
  ["raw", "gmail", "payload"].join("_"),
]);

export function hasGmailCredentialLeak(value: unknown): boolean {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasGmailCredentialLeak(item));
  }

  return Object.entries(value as Record<string, unknown>).some(
    ([key, nested]) =>
      forbiddenCredentialKeys.has(key.toLowerCase()) ||
      hasGmailCredentialLeak(nested),
  );
}
