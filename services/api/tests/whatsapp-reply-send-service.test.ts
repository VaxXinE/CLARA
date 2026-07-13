import { describe, expect, it } from "vitest";
import type { WhatsappOutboundSendClient } from "../src/channels/whatsapp/whatsapp-outbound-send-client";
import { FixtureChannelAccountRepository } from "../src/channels/channel-account-repository";
import { FixtureWhatsappOutboundDeliveryRepository } from "../src/channels/whatsapp/whatsapp-outbound-delivery-repository";
import { WhatsappReplySendService } from "../src/channels/whatsapp/whatsapp-reply-send-service";
import { SimulatedWhatsappOutboundSendClient } from "../src/channels/whatsapp/simulated-whatsapp-outbound-send-client";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const scope = {
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
};

function service(client: WhatsappOutboundSendClient) {
  const store = createFixtureAppStore();

  return {
    service: new WhatsappReplySendService(
      new FixtureChannelAccountRepository(store),
      new FixtureWhatsappOutboundDeliveryRepository(store),
      client,
    ),
    store,
  };
}

describe("WhatsappReplySendService", () => {
  it("sends simulated WhatsApp replies only for WhatsApp conversations", async () => {
    const { service: whatsapp } = service(
      new SimulatedWhatsappOutboundSendClient(),
    );

    const delivery = await whatsapp.send({
      actor: {
        userId: "usr_demo_agent",
        role: "agent",
      },
      scope,
      conversationId: "conv_demo_budi_stock",
      conversationSource: "whatsapp",
      recipientExternalId: "628000000001",
      body: "We can help.",
      correlationId: "corr_1",
    });

    await expect(
      whatsapp.send({
        actor: {
          userId: "usr_demo_agent",
          role: "agent",
        },
        scope,
        conversationId: "conv_demo_budi_stock",
        conversationSource: "webchat",
        recipientExternalId: "628000000001",
        body: "Wrong channel",
        correlationId: "corr_2",
      }),
    ).rejects.toThrow("Conversation is not a WhatsApp conversation.");

    expect(delivery).toMatchObject({
      provider: "whatsapp",
      status: "simulated",
      reasonCode: "simulated_send_completed",
    });
  });

  it("maps provider failures to safe delivery records without triggering AI draft or other providers", async () => {
    const failingClient: WhatsappOutboundSendClient = {
      send: async () => {
        throw new Error("provider raw failure with token-like details");
      },
    };
    const { service: whatsapp, store } = service(failingClient);

    const delivery = await whatsapp.send({
      actor: {
        userId: "usr_demo_agent",
        role: "agent",
      },
      scope,
      conversationId: "conv_demo_budi_stock",
      conversationSource: "whatsapp",
      recipientExternalId: "628000000001",
      body: "We can help.",
      correlationId: "corr_3",
    });
    const serialized = JSON.stringify(delivery);

    expect(delivery).toMatchObject({
      status: "failed",
      reasonCode: "provider_send_failed",
    });
    expect(store.aiDraftEvents).toHaveLength(1);
    expect(store.webchatOutboundDeliveries).toHaveLength(0);
    expect(store.emailOutboundDeliveries).toHaveLength(0);
    expect(serialized).not.toContain("provider raw failure");
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("Authorization");
  });
});
