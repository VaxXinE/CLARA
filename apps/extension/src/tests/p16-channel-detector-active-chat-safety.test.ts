import { describe, expect, it } from "vitest";
import { detectExtensionChannel } from "../readers/channel-detector";

describe("P16 channel detector active-chat safety", () => {
  it("classifies only supported active-chat contexts", () => {
    expect(detectExtensionChannel("https://web.whatsapp.com/")).toEqual({
      supported: true,
      channel: "whatsapp",
    });
    expect(
      detectExtensionChannel("https://www.instagram.com/direct/t/123"),
    ).toEqual({ supported: true, channel: "instagram" });
    expect(detectExtensionChannel("https://www.tiktok.com/messages")).toEqual({
      supported: true,
      channel: "tiktok",
    });
  });

  it("fails closed for unsupported pages and non-active contexts", () => {
    expect(detectExtensionChannel("not a url")).toEqual({
      supported: false,
      reasonCode: "unsupported_host",
    });
    expect(detectExtensionChannel("https://www.instagram.com/explore")).toEqual(
      {
        supported: false,
        reasonCode: "unsupported_context",
      },
    );
    expect(detectExtensionChannel("https://www.tiktok.com/@creator")).toEqual({
      supported: false,
      reasonCode: "unsupported_context",
    });
  });
});
