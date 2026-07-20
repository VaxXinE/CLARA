import type { RedactionClassifierRule } from "./redaction-hardening-types";

export const redactionClassifierRules: RedactionClassifierRule[] = [
  {
    classifierKey: "credential_fields",
    label: "Credential fields",
    detects: ["token", "secret", "password"],
    action: "block",
    severity: "critical",
  },
  {
    classifierKey: "session_fields",
    label: "Session fields",
    detects: ["cookie", "session", "authorization"],
    action: "redact",
    severity: "critical",
  },
  {
    classifierKey: "raw_payload_fields",
    label: "Raw payload fields",
    detects: ["provider payload", "webhook payload", "audit metadata"],
    action: "redact",
    severity: "critical",
  },
  {
    classifierKey: "unsafe_render_fields",
    label: "Unsafe render fields",
    detects: ["DOM", "HTML", "prompt"],
    action: "classify",
    severity: "warning",
  },
];

export function getRedactionClassifierRules(): RedactionClassifierRule[] {
  return redactionClassifierRules;
}
