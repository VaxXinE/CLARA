import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const runtimeFiles = [
  "src/customers/customer-follow-up-proposal-types.ts",
  "src/customers/customer-follow-up-proposal-dto.ts",
  "src/customers/customer-follow-up-proposal-policy.ts",
  "src/customers/customer-follow-up-proposal-service.ts",
  "src/http/routes/customer-follow-up-proposals.ts",
];

describe("P8 customer follow-up proposal security", () => {
  it("keeps follow-up proposal runtime free of token and direct mutation patterns", () => {
    const source = runtimeFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");

    for (const value of [
      "access_token",
      "refresh_token",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawDom",
      "rawHtml",
      "rawPrompt",
      "OPENAI_API_KEY",
      "GEMINI_API_KEY",
      "ANTHROPIC_API_KEY",
      "dangerouslySetInnerHTML",
    ]) {
      expect(source).not.toContain(value);
    }
  });
});
