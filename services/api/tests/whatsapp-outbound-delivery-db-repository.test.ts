import { describe, expect, it } from "vitest";
import { FixtureWhatsappOutboundDeliveryRepository } from "../src/channels/whatsapp/whatsapp-outbound-delivery-repository";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";

const scope = {
  organizationId: "org_demo",
  workspaceId: "wks_demo_sales",
};

describe("WhatsappOutboundDeliveryRepository behavior", () => {
  it("persists safe scoped delivery records", async () => {
    const repository = new FixtureWhatsappOutboundDeliveryRepository(
      createFixtureAppStore(),
    );

    const record = await repository.recordDelivery({
      scope,
      channelAccountId: "channel_account_demo_whatsapp",
      conversationId: "conv_demo_budi_stock",
      status: "simulated",
      reasonCode: "simulated_send_completed",
      providerMessageId: "wamid_sim_safe",
      sentAt: new Date("2026-07-13T00:00:00.000Z"),
      metadata: {
        source: "whatsapp_reply_send",
        transport: "simulated",
        recipient_count: 1,
      },
    });
    const owned = await repository.findByIdScoped(scope, record.id);
    const crossWorkspace = await repository.findByIdScoped(
      {
        organizationId: "org_demo_other",
        workspaceId: "wks_demo_other",
      },
      record.id,
    );
    const serialized = JSON.stringify(owned);

    expect(owned).toMatchObject({
      id: record.id,
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      provider: "whatsapp",
      status: "simulated",
    });
    expect(crossWorkspace).toBeNull();
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("cookie");
    expect(serialized).not.toContain("raw_provider");
    expect(serialized).not.toContain("Need help");
  });
});
