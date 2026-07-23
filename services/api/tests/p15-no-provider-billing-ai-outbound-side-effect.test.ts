import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "src");

describe("P15 no provider billing AI outbound side effect", () => {
  it("does not activate billing, provider, AI, outbound, support, job, or export runtime", () => {
    const runtime = [
      "auth/permissions.ts",
      "customers/customer-service.ts",
      "conversations/conversation-service.ts",
      "http/routes/customers.ts",
      "http/routes/conversations.ts",
    ]
      .map((file) => readFileSync(resolve(root, file), "utf8"))
      .join("\n");

    expect(runtime).not.toMatch(/stripe|checkout|invoice|chargeCustomer/i);
    expect(runtime).not.toMatch(/OpenAI|Anthropic|runAiAction|autoSend/);
    expect(runtime).not.toMatch(/sendSlack|sendDiscord|sendWebhook/i);
    expect(runtime).not.toMatch(/queue\.add|enqueue|cron\.schedule|new Worker/);
    expect(runtime).not.toMatch(/exportReport|generateReport|heavyAnalytics/i);
  });
});
