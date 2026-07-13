import { describe, expect, it } from "vitest";
import { ChannelRegistryService } from "../src/channels/channel-registry-service";

describe("ChannelRegistryService", () => {
  it("returns available channels and planned metadata only for future channels", () => {
    const service = new ChannelRegistryService();

    const capabilities = service.listCapabilities();
    const gmail = capabilities.find((item) => item.provider === "gmail");
    const whatsapp = capabilities.find((item) => item.provider === "whatsapp");
    const webchat = capabilities.find((item) => item.provider === "webchat");

    expect(gmail).toMatchObject({
      provider: "gmail",
      channel_type: "email",
      inbound_supported: true,
      outbound_supported: true,
      production_status: "available",
    });
    expect(webchat).toMatchObject({
      provider: "webchat",
      channel_type: "webchat",
      inbound_supported: true,
      outbound_supported: false,
      production_status: "available",
    });
    expect(whatsapp).toMatchObject({
      provider: "whatsapp",
      channel_type: "messaging",
      inbound_supported: true,
      outbound_supported: false,
      production_status: "available",
    });
    expect(
      capabilities
        .filter(
          (item) => !["gmail", "whatsapp", "webchat"].includes(item.provider),
        )
        .every((item) => item.production_status === "planned"),
    ).toBe(true);
    expect(JSON.stringify(capabilities)).not.toContain("access_token");
    expect(JSON.stringify(capabilities)).not.toContain("refresh_token");
    expect(JSON.stringify(capabilities)).not.toContain("client_secret");
  });
});
