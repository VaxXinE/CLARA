import { describe, expect, it } from "vitest";
import { FixtureChannelAccountRepository } from "../src/channels/channel-account-repository";
import { WhatsappInboundMaterializationService } from "../src/channels/whatsapp/whatsapp-inbound-materialization-service";
import { WhatsappInboundPersistenceService } from "../src/channels/whatsapp/whatsapp-inbound-persistence-service";
import { FixtureWhatsappInboundRepository } from "../src/channels/whatsapp/whatsapp-inbound-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

function normalizedMessage(id = "wamid_materialized_1") {
  return {
    provider: "whatsapp" as const,
    channelType: "messaging" as const,
    externalMessageId: id,
    externalConversationId: null,
    senderExternalId: "628000000001",
    senderDisplayName: "Ada",
    messageText: "Need help",
    metadata: {
      phone_number_id: "wa_phone_demo",
      display_phone_number: "15550000000",
    },
    receivedAt: new Date("2026-07-13T00:00:00.000Z"),
  };
}

describe("WhatsappInboundMaterializationService", () => {
  it("resolves organization and workspace scope from the channel account", async () => {
    const store = createFixtureAppStore();
    const repository = new FixtureWhatsappInboundRepository(store);
    const service = new WhatsappInboundMaterializationService(
      new FixtureChannelAccountRepository(store),
      new WhatsappInboundPersistenceService(repository),
    );

    const result = await service.materialize({
      phoneNumberId: "wa_phone_demo",
      message: normalizedMessage(),
    });
    const state = repository.getState();

    expect(result.duplicate).toBe(false);
    expect(state.whatsappInboundMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: result.whatsappInboundId,
          organizationId: "org_demo",
          workspaceId: "wks_demo_sales",
          channelAccountId: "channel_account_demo_whatsapp",
        }),
      ]),
    );
    expect(state.aiDraftEvents).toHaveLength(1);
    expect(state.emailOutboundDeliveries).toHaveLength(0);
    expect(JSON.stringify(state.whatsappInboundMessages)).not.toContain(
      "raw_provider",
    );
  });

  it("rejects unknown channel accounts safely", async () => {
    const store = createFixtureAppStore();
    const service = new WhatsappInboundMaterializationService(
      new FixtureChannelAccountRepository(store),
      new WhatsappInboundPersistenceService(
        new FixtureWhatsappInboundRepository(store),
      ),
    );

    await expect(
      service.materialize({
        phoneNumberId: "missing_phone",
        message: normalizedMessage("wamid_missing_account"),
      }),
    ).rejects.toThrow("WhatsApp channel account not found.");
  });
});
