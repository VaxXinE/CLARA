import { describe, expect, it } from "vitest";
import type { WebchatReplyAdapter } from "../src/channels/webchat/webchat-reply-adapter";
import { WebchatReplySendService } from "../src/channels/webchat/webchat-reply-send-service";
import { FixtureChannelAccountRepository } from "../src/channels/channel-account-repository";
import { FixtureWebchatOutboundDeliveryRepository } from "../src/channels/webchat/webchat-outbound-delivery-repository";
import { SimulatedWebchatReplyAdapter } from "../src/channels/webchat/simulated-webchat-reply-adapter";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const scope = {
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
};

function createService(
  adapter: WebchatReplyAdapter = new SimulatedWebchatReplyAdapter(),
) {
  const store = createFixtureAppStore();

  return new WebchatReplySendService(
    new FixtureChannelAccountRepository(store),
    new FixtureWebchatOutboundDeliveryRepository(store),
    adapter,
  );
}

describe("webchat reply send service", () => {
  it("sends and persists a simulated webchat reply result", async () => {
    const service = createService();

    const result = await service.send({
      actor: {
        userId: "usr_demo_agent",
        role: "agent",
      },
      scope,
      conversationId: "conv_demo_sari_followup",
      conversationSource: "web_chat_demo",
      body: "Thanks, we can help.",
      correlationId: "req_webchat",
    });

    expect(result).toMatchObject({
      provider: "webchat",
      status: "simulated",
      reasonCode: "simulated_send_completed",
      channelAccountId: "channel_account_demo_webchat",
    });
    expect(JSON.stringify(result)).not.toContain("Thanks, we can help.");
  });

  it("rejects non-webchat conversations before sending", async () => {
    const service = createService();

    await expect(
      service.send({
        actor: {
          userId: "usr_demo_agent",
          role: "agent",
        },
        scope,
        conversationId: "conv_demo_budi_stock",
        conversationSource: "whatsapp_demo",
        body: "Wrong channel",
        correlationId: "req_wrong_channel",
      }),
    ).rejects.toMatchObject({
      statusCode: 400,
    });
  });

  it("blocks viewer mutation", async () => {
    const service = createService();

    await expect(
      service.send({
        actor: {
          userId: "usr_demo_viewer",
          role: "viewer",
        },
        scope,
        conversationId: "conv_demo_sari_followup",
        conversationSource: "web_chat_demo",
        body: "Viewer should not send",
        correlationId: "req_viewer",
      }),
    ).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  it("maps provider failures to safe reason_code", async () => {
    const service = createService({
      async sendReply() {
        throw new Error("raw provider failure access_token=atk");
      },
    });

    const result = await service.send({
      actor: {
        userId: "usr_demo_agent",
        role: "agent",
      },
      scope,
      conversationId: "conv_demo_sari_followup",
      conversationSource: "web_chat_demo",
      body: "Please send safely",
      correlationId: "req_failure",
    });
    const serialized = JSON.stringify(result);

    expect(result).toMatchObject({
      provider: "webchat",
      status: "failed",
      reasonCode: "provider_send_failed",
    });
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("raw provider failure");
    expect(serialized).not.toContain("Please send safely");
  });
});
