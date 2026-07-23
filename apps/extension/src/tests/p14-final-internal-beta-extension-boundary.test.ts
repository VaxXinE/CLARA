import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P14 final internal beta extension boundary", () => {
  it("does not expose go-live, deploy, support, billing, provider, AI, or outbound powers", () => {
    const methods = Object.getOwnPropertyNames(
      ClaraExtensionApiClient.prototype,
    );

    expect(methods).not.toContain("goLiveInternalBeta");
    expect(methods).not.toContain("deployProduction");
    expect(methods).not.toContain("rollbackProduction");
    expect(methods).not.toContain("submitFeedback");
    expect(methods).not.toContain("createSupportTicket");
    expect(methods).not.toContain("activateBilling");
    expect(methods).not.toContain("activateProvider");
    expect(methods).not.toContain("runAiAction");
    expect(methods).not.toContain("autoSend");
    expect(methods).not.toContain("sendNotification");
  });
});
