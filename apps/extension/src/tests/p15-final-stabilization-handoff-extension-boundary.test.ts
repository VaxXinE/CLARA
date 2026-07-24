import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P15 final stabilization handoff extension boundary", () => {
  it("does not add provider, issue submission, notification, role, import, billing, AI, or outbound powers", () => {
    const methods = Object.getOwnPropertyNames(
      ClaraExtensionApiClient.prototype,
    );

    expect(methods).not.toContain("callOfficialProviderApi");
    expect(methods).not.toContain("submitUatIssue");
    expect(methods).not.toContain("sendNotification");
    expect(methods).not.toContain("updateRole");
    expect(methods).not.toContain("importCustomers");
    expect(methods).not.toContain("activateBilling");
    expect(methods).not.toContain("callAiProvider");
    expect(methods).not.toContain("autoSend");
  });
});
