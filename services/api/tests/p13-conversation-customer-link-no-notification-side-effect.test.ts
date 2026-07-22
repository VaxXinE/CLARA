import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

describe("P13 conversation customer link notification boundary", () => {
  it("does not send email, Slack, Discord, webhook, or support notifications", () => {
    const source = readFileSync(
      path.resolve(__dirname, "../src/conversations/conversation-service.ts"),
      "utf8",
    );

    expect(source).not.toMatch(/slack|discord|webhook|notification|support/i);
  });
});
