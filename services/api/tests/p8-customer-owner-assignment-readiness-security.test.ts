import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const routeSource = readFileSync(
  new URL(
    "../src/http/routes/customer-owner-assignment-readiness.ts",
    import.meta.url,
  ),
  "utf8",
);
const serviceSource = readFileSync(
  new URL(
    "../src/customers/customer-owner-assignment-readiness-service.ts",
    import.meta.url,
  ),
  "utf8",
);

describe("P8 customer owner assignment readiness security", () => {
  it("keeps backend readiness scoped, read-only, and free of unsafe exposure patterns", () => {
    const source = `${routeSource}\n${serviceSource}`;

    for (const value of [
      "dangerouslySetInnerHTML",
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
    ]) {
      expect(source).not.toContain(value);
    }

    expect(source).toContain("getWorkspaceScopeFromAuth");
    expect(source).toContain("ownerAssigned: false");
    expect(source).toContain("actionExecuted: false");
    expect(source).not.toContain("insert(");
    expect(source).not.toContain("update(");
    expect(source).not.toContain("delete(");
  });
});
