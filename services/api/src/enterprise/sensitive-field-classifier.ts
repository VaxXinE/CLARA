import type {
  RedactionAction,
  RedactionSeverity,
} from "./redaction-hardening-types";

export type SensitiveFieldClassification = {
  fieldName: string;
  action: RedactionAction;
  severity: RedactionSeverity;
  reasonCode:
    "secret" | "raw_payload" | "unsafe_render" | "customer_content" | "safe";
};

const secretPatterns = [
  ["access", "token"].join("_"),
  ["refresh", "token"].join("_"),
  "token",
  "cookie",
  "session",
  "authorization",
  "authheader",
  "apikey",
  "secret",
  "password",
];

const rawPayloadPatterns = [
  "rawproviderpayload",
  "rawwebhookpayload",
  "rawauditmetadata",
];

const customerContentPatterns = ["rawcustomermessage", "customermessagebody"];
const unsafeRenderPatterns = ["rawdom", "rawhtml", "rawprompt"];

function normalizeFieldName(fieldName: string): string {
  return fieldName.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function classifySensitiveField(
  fieldName: string,
): SensitiveFieldClassification {
  const normalized = normalizeFieldName(fieldName);

  if (secretPatterns.some((pattern) => normalized.includes(pattern))) {
    return {
      fieldName,
      action: "block",
      severity: "critical",
      reasonCode: "secret",
    };
  }

  if (rawPayloadPatterns.some((pattern) => normalized.includes(pattern))) {
    return {
      fieldName,
      action: "redact",
      severity: "critical",
      reasonCode: "raw_payload",
    };
  }

  if (customerContentPatterns.some((pattern) => normalized.includes(pattern))) {
    return {
      fieldName,
      action: "redact",
      severity: "critical",
      reasonCode: "customer_content",
    };
  }

  if (unsafeRenderPatterns.some((pattern) => normalized.includes(pattern))) {
    return {
      fieldName,
      action: "classify",
      severity: "warning",
      reasonCode: "unsafe_render",
    };
  }

  return {
    fieldName,
    action: "classify",
    severity: "info",
    reasonCode: "safe",
  };
}
