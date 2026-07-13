import { createHmac, timingSafeEqual } from "node:crypto";
import { AuthorizationError, ValidationError } from "../../errors/app-error";
import type { WhatsappProviderConfig } from "./whatsapp-provider-config";

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export class WhatsappWebhookVerificationService {
  constructor(private readonly config: WhatsappProviderConfig) {}

  verifyChallenge(input: {
    mode: string | undefined;
    verifyToken: string | undefined;
    challenge: string | undefined;
  }): string {
    if (!this.config.verifyToken) {
      throw new ValidationError(
        "WhatsApp webhook verification is not configured.",
      );
    }

    if (
      input.mode !== "subscribe" ||
      !input.verifyToken ||
      !input.challenge ||
      !safeEqual(input.verifyToken, this.config.verifyToken)
    ) {
      throw new AuthorizationError("Invalid WhatsApp webhook verification.");
    }

    return input.challenge;
  }

  verifySignature(input: {
    signature: string | undefined;
    body: unknown;
  }): void {
    if (!this.config.appSecret) {
      throw new ValidationError(
        "WhatsApp webhook signature verification is not configured.",
      );
    }

    const payload =
      typeof input.body === "string"
        ? input.body
        : JSON.stringify(input.body ?? {});
    const expected =
      "sha256=" +
      createHmac("sha256", this.config.appSecret).update(payload).digest("hex");

    if (!input.signature || !safeEqual(input.signature, expected)) {
      throw new AuthorizationError("Invalid WhatsApp webhook signature.");
    }
  }
}
