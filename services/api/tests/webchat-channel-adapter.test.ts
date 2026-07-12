import { describe, expect, it } from "vitest";
import { SimulatedWebchatChannelAdapter } from "../src/channels/webchat/simulated-webchat-channel-adapter";

describe("SimulatedWebchatChannelAdapter", () => {
  it("normalizes inbound webchat input without network calls or unsafe HTML", async () => {
    const adapter = new SimulatedWebchatChannelAdapter();

    const message = await adapter.normalizeInboundMessage({
      channelPublicKey: "webchat_public_demo",
      visitorId: "visitor-1",
      sessionId: "session-1",
      customerName: "<script>Ada</script>",
      customerEmail: "ADA@example.test",
      messageText: "<b>Hello</b>",
      pageUrl: "https://example.test/pricing",
      userAgent: "Browser",
      metadata: {
        locale: "en",
        raw_provider_config: "blocked",
      },
    });

    expect(message).toMatchObject({
      provider: "webchat",
      channelPublicKey: "webchat_public_demo",
      customerName: "scriptAda/script",
      customerEmail: "ada@example.test",
      messageText: "bHello/b",
      metadata: {
        locale: "en",
      },
    });
    expect(JSON.stringify(message)).not.toContain("raw_provider_config");
  });
});
