import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const runtimeFiles = [
  "src/customers/customer-timeline-intelligence-types.ts",
  "src/customers/customer-timeline-intelligence-dto.ts",
  "src/customers/customer-timeline-intelligence-policy.ts",
  "src/customers/customer-timeline-intelligence-service.ts",
  "src/http/routes/customer-timeline-intelligence.ts",
];

describe("P8 customer timeline intelligence security", () => {
  it("does not add mutation, secret, token, raw payload, or AI provider paths", () => {
    const source = runtimeFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");
    const unsafePatterns = [
      "dangerouslySetInnerHTML",
      ["access", "token"].join("_"),
      ["refresh", "token"].join("_"),
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
