import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P15 internal runtime smoke extension boundary", () => {
  it("does not add smoke execution, notification, provider, AI, billing, or outbound powers", () => {
    const methods = Object.getOwnPropertyNames(
      ClaraExtensionApiClient.prototype,
    );

    expect(methods).not.toContain("executeRuntimeSmoke");
    expect(methods).not.toContain("sendNotification");
    expect(methods).not.toContain("sendWebhook");
    expect(methods).not.toContain("createSupportTicket");
    expect(methods).not.toContain("activateProvider");
    expect(methods).not.toContain("runAiAction");
    expect(methods).not.toContain("activateBilling");
    expect(methods).not.toContain("autoSend");
  });
});
