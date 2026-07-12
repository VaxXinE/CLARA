import { describe, expect, it } from "vitest";
import { SimulatedWebchatReplyAdapter } from "../src/channels/webchat/simulated-webchat-reply-adapter";

describe("simulated webchat reply adapter", () => {
  it("returns a safe simulated reply result without external payloads", async () => {
    const adapter = new SimulatedWebchatReplyAdapter();

    const result = await adapter.sendReply({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      channelAccountId: "channel_account_demo_webchat",
      conversationId: "conv_demo_sari_followup",
      body: "Hello from support",
      correlationId: "req_test",
    });
    const serialized = JSON.stringify(result);

    expect(result).toMatchObject({
      provider: "webchat",
      status: "simulated",
      reasonCode: "simulated_send_completed",
    });
    expect(result.providerMessageId).toContain("conv_demo_sari_followup");
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("raw_provider");
    expect(serialized).not.toContain("client_secret");
  });
});
