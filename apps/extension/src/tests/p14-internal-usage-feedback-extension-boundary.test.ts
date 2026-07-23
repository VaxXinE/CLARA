import { describe, expect, it } from "vitest";
import { ClaraExtensionApiClient } from "../api/clara-extension-api-client";

describe("P14 internal usage feedback extension boundary", () => {
  it("does not expose feedback, support, notification, billing, provider, AI, or outbound powers", () => {
    const methods = Object.getOwnPropertyNames(
      ClaraExtensionApiClient.prototype,
    );

    expect(methods).not.toContain("submitFeedback");
    expect(methods).not.toContain("createSupportTicket");
    expect(methods).not.toContain("sendNotification");
    expect(methods).not.toContain("activateBilling");
    expect(methods).not.toContain("activateProvider");
    expect(methods).not.toContain("runAiFeedback");
    expect(methods).not.toContain("autoSend");
  });
});
