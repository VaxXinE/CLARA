import { describe, expect, it } from "vitest";
import { resolveChatGptCompanionUrl } from "../chatgpt/chatgpt-companion-url";

describe("ChatGPT companion URL", () => {
  it("uses configured safe URL and strips query/hash", () => {
    expect(
      resolveChatGptCompanionUrl("https://chatgpt.com/g/g-demo?q=x#frag"),
    ).toBe("https://chatgpt.com/g/g-demo");
  });

  it("falls back for missing, invalid, or unsupported URL", () => {
    expect(resolveChatGptCompanionUrl()).toBe("https://chatgpt.com/");
    expect(resolveChatGptCompanionUrl("not a url")).toBe(
      "https://chatgpt.com/",
    );
    expect(resolveChatGptCompanionUrl("http://chatgpt.com/")).toBe(
      "https://chatgpt.com/",
    );
    expect(resolveChatGptCompanionUrl("https://example.test/")).toBe(
      "https://chatgpt.com/",
    );
  });
});
