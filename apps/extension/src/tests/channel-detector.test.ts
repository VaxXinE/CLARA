import { describe, expect, it } from "vitest";
import { detectExtensionChannel } from "../readers/channel-detector";

describe("channel detector", () => {
  it("detects supported social hosts", () => {
    expect(detectExtensionChannel("https://web.whatsapp.com/")).toEqual({
      supported: true,
      channel: "whatsapp",
    });
    expect(detectExtensionChannel("https://www.instagram.com/direct/")).toEqual(
      {
        supported: true,
        channel: "instagram",
      },
    );
    expect(detectExtensionChannel("https://www.tiktok.com/messages")).toEqual({
      supported: true,
      channel: "tiktok",
    });
  });

  it("rejects unsupported hosts", () => {
    expect(detectExtensionChannel("https://example.test")).toEqual({
      supported: false,
      reasonCode: "unsupported_host",
    });
  });
});
