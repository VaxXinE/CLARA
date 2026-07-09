const secretKeyPattern =
  /(authorization|cookie|password|token|secret|api[_-]?key|session)/i;

export const redactPaths = [
  "req.headers.authorization",
  "req.headers.cookie",
  'req.headers["x-api-key"]',
  'res.headers["set-cookie"]',
  "*.password",
  "*.token",
  "*.access_token",
  "*.refresh_token",
  "*.api_key",
  "*.secret",
  "*.authorization",
  "*.cookie",
] as const;

function shouldRedactKey(key: string): boolean {
  return secretKeyPattern.test(key);
}

export function redactValue<T>(value: T, key?: string): T | "[REDACTED]" {
  if (key && shouldRedactKey(key)) {
    return "[REDACTED]";
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [
        entryKey,
        redactValue(entryValue, entryKey),
      ]),
    ) as T;
  }

  return value;
}

export function sanitizePath(url: string): string {
  const queryIndex = url.indexOf("?");

  if (queryIndex === -1) {
    return url;
  }

  return url.slice(0, queryIndex);
}
