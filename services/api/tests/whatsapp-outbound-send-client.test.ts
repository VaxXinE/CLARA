import { describe, expect, it } from "vitest";
import { SimulatedWhatsappOutboundSendClient } from "../src/channels/whatsapp/simulated-whatsapp-outbound-send-client";

describe("SimulatedWhatsappOutboundSendClient", () => {
  it("returns deterministic safe simulated send result without network calls", async () => {
    const client = new SimulatedWhatsappOutboundSendClient();

    const result = await client.send({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      channelAccountId: "channel_account_demo_whatsapp",
      conversationId: "conv_demo_budi_stock",
      recipientExternalId: "628000000001",
      textBody: "Need help",
      correlationId: "corr_1",
    });
    const serialized = JSON.stringify(result);

    expect(result).toMatchObject({
      status: "simulated",
      providerMessageId: expect.stringMatching(/^wamid_sim_/),
      reasonCode: "simulated_send_completed",
    });
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("raw_provider");
    expect(serialized).not.toContain("client_secret");
  });
});
