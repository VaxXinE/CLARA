import { describe, expect, it } from "vitest";
import { WhatsappInboundPersistenceService } from "../src/channels/whatsapp/whatsapp-inbound-persistence-service";
import { FixtureWhatsappInboundRepository } from "../src/channels/whatsapp/whatsapp-inbound-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

function input(externalMessageId = "wamid_persist_1") {
  return {
    scope: {
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
    },
    channelAccountId: "channel_account_demo_whatsapp",
    message: {
      provider: "whatsapp" as const,
      channelType: "messaging" as const,
      externalMessageId,
      externalConversationId: null,
      senderExternalId: "628000000001",
      senderDisplayName: "Ada",
      messageText: "Need help",
      metadata: {
        phone_number_id: "wa_phone_demo",
        display_phone_number: "15550000000",
      },
      receivedAt: new Date("2026-07-13T00:00:00.000Z"),
    },
  };
}

describe("WhatsappInboundPersistenceService", () => {
  it("persists inbound WhatsApp customer, conversation, message, activity, and idempotency record", async () => {
    const repository = new FixtureWhatsappInboundRepository(
      createFixtureAppStore(),
    );
    const service = new WhatsappInboundPersistenceService(repository);

    const result = await service.persist(input());
    const state = repository.getState();

    expect(result.duplicate).toBe(false);
    expect(state.customers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: result.customerId,
          source: "whatsapp",
          contactIdentifier:
            "whatsapp:channel_account_demo_whatsapp:628000000001",
        }),
      ]),
    );
    expect(state.conversations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: result.conversationId,
          source: "whatsapp",
        }),
      ]),
    );
    expect(state.messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: result.messageId,
          direction: "inbound",
          body: "Need help",
        }),
      ]),
    );
    expect(state.activityEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: result.activityId,
          eventType: "whatsapp_received",
        }),
      ]),
    );
  });
});
