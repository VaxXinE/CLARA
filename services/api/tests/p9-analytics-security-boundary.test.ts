import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const analyticsSourceDir = join(__dirname, "../src/analytics");

function readAnalyticsSource(): string {
  return readdirSync(analyticsSourceDir)
    .filter((file) => file.endsWith(".ts"))
    .map((file) => readFileSync(join(analyticsSourceDir, file), "utf8"))
    .join("\n");
}

describe("P9 analytics security boundary", () => {
  it("does not add provider, AI, CRM mutation, or outbound side effects", () => {
    const source = readAnalyticsSource();

    for (const pattern of [
      "@ai-sdk",
      "OPENAI_API_KEY",
      "GEMINI_API_KEY",
      "ANTHROPIC_API_KEY",
      "fetch(",
      "sendReply",
      "createTask",
      "writeCustomerNote",
      "assignOwner",
      "updateLifecycle",
      "updateStatus",
      "scheduler",
    ]) {
      expect(source).not.toContain(pattern);
    }
  });
});
