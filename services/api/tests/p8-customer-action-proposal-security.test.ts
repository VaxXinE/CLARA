import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const runtimeFiles = [
  "src/customers/customer-action-proposal-types.ts",
  "src/customers/customer-action-proposal-dto.ts",
  "src/customers/customer-action-proposal-policy.ts",
  "src/customers/customer-action-proposal-service.ts",
  "src/http/routes/customer-action-proposals.ts",
];

describe("P8 customer action proposal security", () => {
  it("does not add CRM execution, secret, token, raw payload, or AI provider paths", () => {
    const source = runtimeFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");
    const unsafePatterns = [
      "dangerouslySetInnerHTML",
      "access_token",
      "refresh_token",
      "providerCookie",
      "sessionCookie",
      "rawProviderPayload",
      "raw_provider_payload",
      "rawWebhookPayload",
      "raw_webhook_payload",
      "rawDom",
      "rawHtml",
      "rawPrompt",
      "OPENAI_API_KEY",
      "GEMINI_API_KEY",
      "ANTHROPIC_API_KEY",
      "@ai-sdk",
      "autoCreateTask",
      "autoWriteCustomerNote",
      "autoAssignOwner",
      "autoChangeLifecycle",
      "autoChangeStatus",
    ];

    for (const pattern of unsafePatterns) {
      expect(source).not.toContain(pattern);
    }
  });
});
