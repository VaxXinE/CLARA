import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P8 final CRM workflow extension security regression", () => {
  it("keeps extension free of CRM workflow execution and secret exposure", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "executeCrmAction",
      "createTask",
      "scheduleTask",
      "assignOwner",
      "updateLifecycle",
      "updateStatus",
      "writeCustomerNote",
      "accessToken",
      "refreshToken",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawDom",
      "rawHtml",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
