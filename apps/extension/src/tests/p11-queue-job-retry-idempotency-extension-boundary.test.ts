import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P11 queue job retry idempotency extension boundary", () => {
  it("keeps queue, retry, idempotency, and Dead Letter internals out of the extension runtime", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "queueJobReliability",
      "retryBackoffPolicy",
      "idempotencyPolicy",
      "deadLetterQueue",
      "jobFailureClassification",
      "jobExecution",
      "jobEnqueue",
      "retryExecution",
      "jobReplay",
      "jobPurge",
      "rawJobPayload",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawCustomerMessage",
      "accessToken",
      "refreshToken",
      "authorizationHeader",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
