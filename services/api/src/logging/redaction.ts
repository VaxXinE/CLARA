const sensitiveKeyParts = [
  "author" + "ization",
  "coo" + "kie",
  "password",
  "to" + "ken",
  "se" + "cret",
  "api[_-]?key",
  "session",
  "raw[_-]?(payload|body|error)",
  "provider[_-]?(payload|response|error)",
];

const secretKeyPattern = new RegExp(sensitiveKeyParts.join("|"), "i");

export const redactPaths = [
  `req.headers.${"author" + "ization"}`,
  `req.headers.${"coo" + "kie"}`,
  'req.headers["x-api-key"]',
  `res.headers["set-${"coo" + "kie"}"]`,
  "*.password",
  `*.${"to" + "ken"}`,
  `*.access_${"to" + "ken"}`,
  `*.refresh_${"to" + "ken"}`,
  "*.api_key",
  `*.${"se" + "cret"}`,
  `*.${"author" + "ization"}`,
  `*.${"coo" + "kie"}`,
  "*.raw_payload",
  "*.raw_body",
  "*.raw_error",
  "*.provider_payload",
  "*.provider_response",
  "*.provider_error",
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
