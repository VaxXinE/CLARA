import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P16 extension-assisted transition boundary", () => {
  it("keeps extension-assisted ingestion user-assisted and bounded", () => {
    const methods = Object.getOwnPropertyNames(
      ClaraExtensionApiClient.prototype,
    );

    expect(methods).toContain("postSnapshot");
    expect(methods).not.toContain("crawlInbox");
    expect(methods).not.toContain("readProviderToken");
    expect(methods).not.toContain("sendProviderMessage");
    expect(methods).not.toContain("activateOfficialWhatsAppApi");
    expect(methods).not.toContain("activateOfficialInstagramApi");
    expect(methods).not.toContain("activateOfficialTikTokApi");
  });
});
