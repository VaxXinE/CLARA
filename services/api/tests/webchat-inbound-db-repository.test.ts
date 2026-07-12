import { describe, expect, it } from "vitest";
import { FixtureWebchatInboundRepository } from "../src/channels/webchat/webchat-inbound-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

describe("WebchatInboundRepository", () => {
  it("deduplicates conversation by scoped webchat session", async () => {
    const repository = new FixtureWebchatInboundRepository(
      createFixtureAppStore(),
    );
    const base = {
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      channelAccountId: "channel_account_demo_webchat",
      message: {
        provider: "webchat" as const,
        channelPublicKey: "webchat_public_demo",
        visitorId: "visitor-1",
        sessionId: "session-1",
        customerName: "Ada",
        customerEmail: "ada@example.test",
        messageText: "Need help",
        pageUrl: null,
        userAgent: null,
        metadata: {},
        receivedAt: new Date("2026-07-12T00:00:00.000Z"),
      },
    };

    const first = await repository.persistInboundMessage(base);
    const second = await repository.persistInboundMessage({
      ...base,
      message: {
        ...base.message,
        messageText: "Follow up",
        receivedAt: new Date("2026-07-12T00:01:00.000Z"),
      },
    });
    const state = repository.getState();

    expect(second.conversationId).toBe(first.conversationId);
    expect(state.webchatInboundMessages).toHaveLength(2);
    expect(JSON.stringify(state)).not.toContain("access_token");
    expect(JSON.stringify(state)).not.toContain("refresh_token");
    expect(JSON.stringify(state)).not.toContain("raw provider");
  });
});
