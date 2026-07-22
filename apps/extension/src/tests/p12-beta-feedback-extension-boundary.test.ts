import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P12 beta feedback extension boundary", () => {
  it("keeps extension out of support tool and notification authority", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "createSupportTicket",
      "createExternalTicket",
      "sendEmailNotification",
      "sendSlackMessage",
      "sendDiscordMessage",
      "webhookNotify",
      "callRealAiProvider",
      "autoSend",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
