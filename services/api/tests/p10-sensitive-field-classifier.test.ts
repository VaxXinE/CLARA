import { describe, expect, it } from "vitest";
import { classifySensitiveField } from "../src/enterprise/sensitive-field-classifier";

describe("P10 sensitive field classifier", () => {
  it("blocks or redacts sensitive compliance fields", () => {
    const cases = [
      ["access_token", "block"],
      ["refresh_token", "block"],
      ["token", "block"],
      ["cookie", "block"],
      ["session", "block"],
      ["authorization", "block"],
      ["auth header", "block"],
      ["api key", "block"],
      ["secret", "block"],
      ["password", "block"],
      ["rawProviderPayload", "redact"],
      ["raw_provider_payload", "redact"],
      ["rawWebhookPayload", "redact"],
      ["raw_webhook_payload", "redact"],
      ["rawAuditMetadata", "redact"],
      ["raw_audit_metadata", "redact"],
      ["rawCustomerMessage", "redact"],
      ["raw_customer_message", "redact"],
      ["customerMessageBody", "redact"],
      ["rawDom", "classify"],
      ["rawHtml", "classify"],
      ["rawPrompt", "classify"],
      ["providerCookie", "block"],
      ["sessionCookie", "block"],
    ] as const;

    for (const [fieldName, action] of cases) {
      expect(classifySensitiveField(fieldName).action).toBe(action);
    }
  });
});
