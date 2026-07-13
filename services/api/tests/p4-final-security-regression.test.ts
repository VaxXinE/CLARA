import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { channelCapabilities } from "../src/channels/channel-capabilities";
import { ChannelRoutingService } from "../src/channels/channel-routing-service";
import { sanitizeMultichannelAuditMetadata } from "../src/audit/multichannel-audit-policy";

describe("P4 final security regression", () => {
  it("keeps channel availability and future social providers safe", () => {
    const gmail = channelCapabilities.find((item) => item.provider === "gmail");
    const webchat = channelCapabilities.find(
      (item) => item.provider === "webchat",
    );
    const whatsapp = channelCapabilities.find(
      (item) => item.provider === "whatsapp",
    );
    const instagram = channelCapabilities.find(
      (item) => item.provider === "instagram",
    );
    const tiktok = channelCapabilities.find(
      (item) => item.provider === "tiktok",
    );
    const serialized = JSON.stringify(channelCapabilities);

    expect(gmail?.production_status).toBe("available");
    expect(webchat?.production_status).toBe("available");
    expect(whatsapp).toMatchObject({
      production_status: "available",
      inbound_supported: true,
      outbound_supported: true,
    });
    expect(instagram).toMatchObject({
      production_status: "planned",
      inbound_supported: false,
      outbound_supported: false,
    });
    expect(tiktok).toMatchObject({
      production_status: "planned",
      inbound_supported: false,
      outbound_supported: false,
    });
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain(["client", "secret"].join("_"));
    expect(serialized).not.toContain("raw_provider_config");
  });

  it("keeps unified routing scoped to implemented providers only", () => {
    const routing = new ChannelRoutingService();

    expect(routing.resolve("gmail").provider).toBe("gmail");
    expect(routing.resolve("email").provider).toBe("gmail");
    expect(routing.resolve("webchat").provider).toBe("webchat");
    expect(routing.resolve("whatsapp").provider).toBe("whatsapp");
    expect(routing.resolve("instagram").provider).toBe("default");
    expect(routing.resolve("tiktok").provider).toBe("default");
    expect(() => routing.assertProvider("whatsapp", "gmail")).toThrow(
      "Conversation source does not match provider.",
    );
  });

  it("keeps multichannel audit metadata payload-safe", () => {
    const metadata = sanitizeMultichannelAuditMetadata({
      provider: "webchat",
      conversation_id: "conv_demo",
      delivery_id: "delivery_demo",
      direction: "outbound",
      status: "simulated",
      message_body: "unsafe body",
      raw_provider_payload: { id: "raw" },
      authorization_header: "Bearer atk",
      cookie: "sid=abc",
    });
    const serialized = JSON.stringify(metadata);

    expect(metadata).toEqual({
      provider: "webchat",
      conversation_id: "conv_demo",
      delivery_id: "delivery_demo",
      direction: "outbound",
      status: "simulated",
    });
    expect(serialized).not.toContain("unsafe body");
    expect(serialized).not.toContain("raw");
    expect(serialized).not.toContain("Bearer");
    expect(serialized).not.toContain("sid=");
  });

  it("keeps dashboard status surfaces read-only and HTML-safe", () => {
    const appSource = readFileSync("../../apps/dashboard/src/App.tsx", "utf8");
    const webchatStatusSource = readFileSync(
      "../../apps/dashboard/src/components/WebchatStatusPanel.tsx",
      "utf8",
    );
    const allSource = `${appSource}\n${webchatStatusSource}`;

    expect(allSource).not.toContain("dangerouslySetInnerHTML");
    expect(allSource).not.toContain(["access", "token"].join("_"));
    expect(allSource).not.toContain(["refresh", "token"].join("_"));
    expect(allSource).not.toContain("raw provider");
    expect(allSource).not.toMatch(new RegExp(["re", "send"].join(""), "i"));
    expect(allSource).not.toMatch(new RegExp(["re", "try"].join(""), "i"));
  });
});
