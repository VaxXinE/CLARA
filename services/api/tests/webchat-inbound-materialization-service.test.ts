import { describe, expect, it } from "vitest";
import { WebchatInboundMaterializationService } from "../src/channels/webchat/webchat-inbound-materialization-service";
import { WebchatInboundPersistenceService } from "../src/channels/webchat/webchat-inbound-persistence-service";
import { FixtureWebchatInboundRepository } from "../src/channels/webchat/webchat-inbound-repository";
import { FixtureChannelAccountRepository } from "../src/channels/channel-account-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

describe("WebchatInboundMaterializationService", () => {
  it("resolves tenant scope from channel account public key", async () => {
    const store = createFixtureAppStore();
    const service = new WebchatInboundMaterializationService(
      new FixtureChannelAccountRepository(store),
      new WebchatInboundPersistenceService(
        new FixtureWebchatInboundRepository(store),
      ),
    );

    const result = await service.materialize({
      message: {
        provider: "webchat",
        channelPublicKey: "webchat_public_demo",
        visitorId: "visitor-1",
        sessionId: "session-1",
        customerName: null,
        customerEmail: null,
        messageText: "Need help",
        pageUrl: null,
        userAgent: null,
        metadata: {},
        receivedAt: new Date("2026-07-12T00:00:00.000Z"),
      },
    });

    expect(result.conversationId).toEqual(expect.any(String));
  });

  it("rejects unknown or disabled channel accounts safely", async () => {
    const store = createFixtureAppStore();
    const service = new WebchatInboundMaterializationService(
      new FixtureChannelAccountRepository(store),
      new WebchatInboundPersistenceService(
        new FixtureWebchatInboundRepository(store),
      ),
    );

    await expect(
      service.materialize({
        message: {
          provider: "webchat",
          channelPublicKey: "missing",
          visitorId: null,
          sessionId: null,
          customerName: null,
          customerEmail: null,
          messageText: "Need help",
          pageUrl: null,
          userAgent: null,
          metadata: {},
          receivedAt: new Date("2026-07-12T00:00:00.000Z"),
        },
      }),
    ).rejects.toThrow("Webchat channel account not found.");
  });
});
