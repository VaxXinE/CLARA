import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P16 no expanded capture regression", () => {
  it("keeps the extension client limited to user-assisted snapshot submission", () => {
    const methods = Object.getOwnPropertyNames(
      ClaraExtensionApiClient.prototype,
    );

    expect(methods).not.toContain("crawlBackgroundInbox");
    expect(methods).not.toContain("massScrapeThreads");
    expect(methods).not.toContain("clickSendButton");
    expect(methods).not.toContain("captureHiddenConversation");
  });
});
