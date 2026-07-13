import { describe, expect, it } from "vitest";
import { FixtureWhatsappInboundRepository } from "../src/channels/whatsapp/whatsapp-inbound-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

function input(
  organizationId: string,
  workspaceId: string,
  externalMessageId = "wamid_repo_1",
) {
  return {
    scope: {
      organizationId,
      workspaceId,
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

describe("WhatsappInboundRepository behavior", () => {
  it("deduplicates provider message ids inside organization and workspace scope", async () => {
    const repository = new FixtureWhatsappInboundRepository(
      createFixtureAppStore(),
    );

    const first = await repository.persistInboundMessage(
      input("org_demo", "wks_demo_sales"),
    );
    const duplicate = await repository.persistInboundMessage(
      input("org_demo", "wks_demo_sales"),
    );
    const otherWorkspace = await repository.persistInboundMessage(
      input("org_demo_other", "wks_demo_other"),
    );

    expect(first.duplicate).toBe(false);
    expect(duplicate.duplicate).toBe(true);
    expect(duplicate.conversationId).toBe(first.conversationId);
    expect(otherWorkspace.duplicate).toBe(false);
    expect(otherWorkspace.conversationId).not.toBe(first.conversationId);
  });
});
