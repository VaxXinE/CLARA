import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P16 extension-assisted channel scope boundary", () => {
  it("keeps extension-assisted ingestion active-chat/user-assisted only", () => {
    const methods = Object.getOwnPropertyNames(
      ClaraExtensionApiClient.prototype,
    );

    expect(methods).toContain("postSnapshot");
    expect(methods).not.toContain("crawlInbox");
    expect(methods).not.toContain("massScrapeConversations");
    expect(methods).not.toContain("dumpFullPage");
  });
});
