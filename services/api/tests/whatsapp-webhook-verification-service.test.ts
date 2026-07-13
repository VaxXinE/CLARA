import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { WhatsappWebhookVerificationService } from "../src/channels/whatsapp/whatsapp-webhook-verification-service";

function signature(body: unknown): string {
  return (
    "sha256=" +
    createHmac("sha256", "as").update(JSON.stringify(body)).digest("hex")
  );
}

describe("WhatsappWebhookVerificationService", () => {
  it("accepts valid challenge verification without returning token", () => {
    const service = new WhatsappWebhookVerificationService({
      verifyToken: "vt",
      appSecret: "as",
    });

    expect(
      service.verifyChallenge({
        mode: "subscribe",
        verifyToken: "vt",
        challenge: "challenge-1",
      }),
    ).toBe("challenge-1");
  });

  it("rejects invalid challenge and signature safely", () => {
    const service = new WhatsappWebhookVerificationService({
      verifyToken: "vt",
      appSecret: "as",
    });

    expect(() =>
      service.verifyChallenge({
        mode: "subscribe",
        verifyToken: "bad",
        challenge: "challenge-1",
      }),
    ).toThrow("Invalid WhatsApp webhook verification.");

    expect(() =>
      service.verifySignature({
        signature: "sha256=bad",
        body: { object: "whatsapp_business_account" },
      }),
    ).toThrow("Invalid WhatsApp webhook signature.");
  });

  it("accepts valid signature without exposing secret material", () => {
    const service = new WhatsappWebhookVerificationService({
      verifyToken: "vt",
      appSecret: "as",
    });
    const body = { object: "whatsapp_business_account" };

    expect(() =>
      service.verifySignature({
        signature: signature(body),
        body,
      }),
    ).not.toThrow();
  });
});
