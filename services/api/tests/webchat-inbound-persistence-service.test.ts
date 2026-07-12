import { describe, expect, it } from "vitest";
import { WebchatInboundPersistenceService } from "../src/channels/webchat/webchat-inbound-persistence-service";
import { FixtureWebchatInboundRepository } from "../src/channels/webchat/webchat-inbound-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const scope = {
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
};

describe("WebchatInboundPersistenceService", () => {
  it("persists safe normalized inbound message and materializes domain rows", async () => {
    const store = createFixtureAppStore();
    const repository = new FixtureWebchatInboundRepository(store);
    const service = new WebchatInboundPersistenceService(repository);

    const result = await service.persistInboundMessage({
      scope,
      channelAccountId: "channel_account_demo_webchat",
      message: {
        provider: "webchat",
        channelPublicKey: "webchat_public_demo",
        visitorId: "visitor-1",
        sessionId: "session-1",
        customerName: "Ada",
        customerEmail: "ada@example.test",
        messageText: "Need help",
        pageUrl: "https://example.test",
        userAgent: null,
        metadata: {
          locale: "en",
        },
        receivedAt: new Date("2026-07-12T00:00:00.000Z"),
      },
    });
    const state = repository.getState();
    const serialized = JSON.stringify(state.webchatInboundMessages);

    expect(result).toMatchObject({
      customerId: expect.any(String),
      conversationId: expect.any(String),
      messageId: expect.any(String),
    });
    expect(state.customers.at(-1)).toMatchObject({
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      source: "webchat",
      contactIdentifier: "ada@example.test",
    });
    expect(state.conversations.at(-1)).toMatchObject({
      source: "webchat",
    });
    expect(state.messages.at(-1)).toMatchObject({
      direction: "inbound",
      body: "Need help",
    });
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("cookie");
    expect(serialized).not.toContain("raw_provider");
  });
});
