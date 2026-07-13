import { describe, expect, it } from "vitest";
import { ChannelRoutingService } from "../src/channels/channel-routing-service";

describe("ChannelRoutingService", () => {
  it("routes each conversation source to the correct provider", () => {
    const service = new ChannelRoutingService();

    expect(service.resolve("email").provider).toBe("gmail");
    expect(service.resolve("gmail").provider).toBe("gmail");
    expect(service.resolve("webchat").provider).toBe("webchat");
    expect(service.resolve("whatsapp").provider).toBe("whatsapp");
    expect(service.resolve("instagram").provider).toBe("default");
    expect(service.resolve("tiktok").provider).toBe("default");
    expect(service.resolve("unknown").provider).toBe("default");
  });

  it("rejects wrong-channel sends safely", () => {
    const service = new ChannelRoutingService();

    expect(() => service.assertProvider("whatsapp", "gmail")).toThrow(
      "Conversation source does not match provider.",
    );
  });
});
