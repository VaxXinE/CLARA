import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "src");

describe("P14 final internal beta no provider AI outbound side effect", () => {
  it("does not activate provider, AI, outbound send, or background execution", () => {
    const runtime = [
      "auth/permissions.ts",
      "customers/customer-service.ts",
      "conversations/conversation-service.ts",
      "http/routes/customers.ts",
      "http/routes/conversations.ts",
    ]
      .map((file) => readFileSync(resolve(root, file), "utf8"))
      .join("\n");

    expect(runtime).not.toMatch(/OpenAI|Anthropic|runAiAction|autoSend/);
    expect(runtime).not.toMatch(/sendExternal|sendNotification/);
    expect(runtime).not.toMatch(/queue\.add|enqueue|cron\.schedule|new Worker/);
  });
});
