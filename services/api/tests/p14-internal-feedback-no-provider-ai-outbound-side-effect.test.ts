import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "src");

describe("P14 internal feedback no provider AI outbound side effect", () => {
  it("does not activate providers, AI, outbound send, jobs, queues, or heavy reports", () => {
    const runtime = [
      "auth/permissions.ts",
      "customers/customer-service.ts",
      "conversations/conversation-service.ts",
    ]
      .map((file) => readFileSync(resolve(root, file), "utf8"))
      .join("\n");

    expect(runtime).not.toMatch(/OpenAI|Anthropic|GmailApi|WhatsAppApi/);
    expect(runtime).not.toMatch(/autoSend|sendExternal|sendNotification/);
    expect(runtime).not.toMatch(/queue\.add|enqueue|cron|worker/i);
    expect(runtime).not.toMatch(/heavyReport|exportReport|runAnalyticsExport/);
  });
});
