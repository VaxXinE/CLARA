import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P15 controlled internal beta extension boundary", () => {
  it("does not expose beta execution, support, import, role, billing, provider, AI, or outbound powers", () => {
    const methods = Object.getOwnPropertyNames(
      ClaraExtensionApiClient.prototype,
    );

    expect(methods).not.toContain("executeInternalBeta");
    expect(methods).not.toContain("submitFeedback");
    expect(methods).not.toContain("createSupportTicket");
    expect(methods).not.toContain("sendNotification");
    expect(methods).not.toContain("importCustomerData");
    expect(methods).not.toContain("updateRole");
    expect(methods).not.toContain("activateBilling");
    expect(methods).not.toContain("activateProvider");
    expect(methods).not.toContain("runAiAction");
    expect(methods).not.toContain("autoSend");
  });
});
