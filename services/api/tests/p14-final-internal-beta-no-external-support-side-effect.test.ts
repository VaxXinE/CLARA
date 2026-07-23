import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "src");

describe("P14 final internal beta no external support side effect", () => {
  it("does not add external support or notification runtime behavior", () => {
    const runtime = [
      "customers/customer-service.ts",
      "conversations/conversation-service.ts",
      "http/routes/customers.ts",
      "http/routes/conversations.ts",
    ]
      .map((file) => readFileSync(resolve(root, file), "utf8"))
      .join("\n");

    expect(runtime).not.toMatch(/sendSlack|sendDiscord|sendWebhook/i);
    expect(runtime).not.toMatch(/pushNotification|createSupportTicket/i);
    expect(runtime).not.toMatch(/zendesk|intercom|freshdesk|jira/i);
  });
});
