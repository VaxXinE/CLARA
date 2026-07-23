import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "src");

function source(...files: string[]) {
  return files
    .map((file) => readFileSync(resolve(root, file), "utf8"))
    .join("\n");
}

describe("P14 internal access no provider AI outbound side effect", () => {
  it("does not activate providers, AI, outbound send, jobs, or queues", () => {
    const runtime = source(
      "auth/permissions.ts",
      "auth/user-role-management-policy.ts",
      "customers/internal-data-import-policy.ts",
      "customers/customer-service.ts",
      "conversations/conversation-service.ts",
    );

    expect(runtime).not.toMatch(/OpenAI|Anthropic|GmailApi|WhatsAppApi/);
    expect(runtime).not.toMatch(/autoSend|sendExternal|sendNotification/);
    expect(runtime).not.toMatch(/queue\.add|enqueue|cron|worker/i);
  });
});
