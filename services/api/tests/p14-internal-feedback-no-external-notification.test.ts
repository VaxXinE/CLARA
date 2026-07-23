import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "src");

describe("P14 internal feedback no external notification", () => {
  it("does not add email, chat, webhook, or push notification send paths", () => {
    const runtime = [
      "auth/permissions.ts",
      "customers/customer-service.ts",
      "conversations/conversation-service.ts",
    ]
      .map((file) => readFileSync(resolve(root, file), "utf8"))
      .join("\n");

    expect(runtime).not.toMatch(
      /sendSlack|sendDiscord|sendWebhook|pushNotification/,
    );
    expect(runtime).not.toMatch(
      /createSupportTicket|notifySupport|sendFeedback/,
    );
  });
});
