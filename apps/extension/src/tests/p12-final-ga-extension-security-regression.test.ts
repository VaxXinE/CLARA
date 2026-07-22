import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P12 final GA extension security regression", () => {
  it("does not add launch automation, support tickets, provider calls, payment, AI, or outbound send authority", () => {
    for (const key of [
      "deployProduction",
      "rollbackProduction",
      "createSupportTicket",
      "createExternalTicket",
      "sendSlackMessage",
      "sendDiscordMessage",
      "sendEmailNotification",
      "webhookNotify",
      "createCheckout",
      "chargeCustomer",
      "callRealAiProvider",
      "autoSend",
      "access_token",
      "refresh_token",
      "Authorization",
      "client_secret",
      "rawProviderPayload",
      "rawHtml",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
