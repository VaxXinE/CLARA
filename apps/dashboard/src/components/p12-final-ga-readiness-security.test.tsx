import appSource from "../App.tsx?raw";
import { describe, expect, it } from "vitest";

describe("P12 final GA dashboard security", () => {
  it("does not add production launch, support tool, provider, payment, AI, or unsafe render actions", () => {
    for (const pattern of [
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
      "dangerouslySetInnerHTML",
    ]) {
      expect(appSource).not.toContain(pattern);
    }
  });
});
