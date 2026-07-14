import { describe, expect, it } from "vitest";
import { AuthorizationError } from "../src/errors/app-error";
import { WhatsappWebhookVerificationService } from "../src/channels/whatsapp/whatsapp-webhook-verification-service";
import { toSafeWebhookError } from "../src/channels/webhook/webhook-safe-error";
import { toSafeOutboundError } from "../src/channels/outbound/outbound-safe-error";
import {
  beginOutboundSend,
  completeOutboundAttempt,
} from "../src/channels/outbound/outbound-delivery-lifecycle";

function expectNoSensitiveFields(value: unknown): void {
  const serialized = JSON.stringify(value);

  expect(serialized).not.toContain("access_token");
  expect(serialized).not.toContain("refresh_token");
  expect(serialized).not.toContain("Authorization");
  expect(serialized).not.toContain("client_secret");
  expect(serialized).not.toContain("raw Gmail payload");
  expect(serialized).not.toContain("provider raw error");
  expect(serialized).not.toContain("email body");
}

describe("P6 webhook and outbox security regression", () => {
  it("keeps WhatsApp verification fail-closed for invalid verify tokens", () => {
    const verifier = new WhatsappWebhookVerificationService({
      verifyToken: "vt",
      appSecret: "as",
    });

    expect(() =>
      verifier.verifyChallenge({
        mode: "subscribe",
        verifyToken: "bad",
        challenge: "challenge",
      }),
    ).toThrow(AuthorizationError);
  });

  it("does not expose provider internals in webhook safe errors", () => {
    expectNoSensitiveFields(toSafeWebhookError("invalid_payload"));
    expectNoSensitiveFields(toSafeWebhookError("duplicate_replay"));
  });

  it("does not expose provider internals in outbound safe errors", () => {
    expectNoSensitiveFields(toSafeOutboundError("provider_unavailable"));
    expectNoSensitiveFields(toSafeOutboundError("max_attempts_exceeded"));
  });

  it("prevents retry storms with terminal dead_letter behavior", () => {
    const sending = beginOutboundSend("retrying");
    const exhausted = completeOutboundAttempt({
      succeeded: false,
      attemptNumber: 5,
      maxAttempts: 5,
      failureKind: "transient",
    });

    expect(sending.status).toBe("sending");
    expect(exhausted).toMatchObject({
      status: "dead_letter",
      safeReasonCode: "max_attempts_exceeded",
    });
    expectNoSensitiveFields(exhausted);
  });
});
