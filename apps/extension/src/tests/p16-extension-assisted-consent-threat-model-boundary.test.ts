import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P16 extension-assisted consent threat model boundary", () => {
  it("does not add cookie, token, auth header, provider API, AI, billing, role, import, or outbound powers", () => {
    const methods = Object.getOwnPropertyNames(
      ClaraExtensionApiClient.prototype,
    );

    expect(methods).not.toContain("readCookies");
    expect(methods).not.toContain("readSessionToken");
    expect(methods).not.toContain("captureAuthHeaders");
    expect(methods).not.toContain("callOfficialProviderApi");
    expect(methods).not.toContain("callAiProvider");
    expect(methods).not.toContain("activateBilling");
    expect(methods).not.toContain("updateRole");
    expect(methods).not.toContain("importCustomers");
    expect(methods).not.toContain("autoSend");
  });
});
