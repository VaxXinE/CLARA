const redacted = "[redacted]";

const secretKey = String.raw`(?:access|refresh)[_\s-]*token|api[_\s-]*key|client[_\s-]*secret`;
const urlSecretKey = String.raw`(?:token|key|secret|password|code|session)`;

const piiRules = [
  /\bBearer\s+\S+/gi,
  new RegExp(String.raw`\b(?:${secretKey})\s*[:=]\s*\S+`, "gi"),
  /\bcookie\s*[:=]\s*\S+/gi,
  /\bauthorization\s*[:=]\s*\S+/gi,
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
  /(?:\+?\d[\d\s().-]{7,}\d)/g,
  /\b(?:\d[ -]*?){13,19}\b/g,
  new RegExp(String.raw`https?:\/\/\S*[?&]${urlSecretKey}=[^\s&]+`, "gi"),
];

export function redactExtensionSnapshotPii(value: string): string {
  return piiRules.reduce(
    (current, rule) => current.replace(rule, redacted),
    value,
  );
}
