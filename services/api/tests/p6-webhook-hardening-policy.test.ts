import { describe, expect, it } from "vitest";
import { AuthorizationError } from "../src/errors/app-error";
import {
  assertSupportedWebhookProvider,
  getWebhookVerificationPolicy,
} from "../src/channels/webhook/webhook-hardening-policy";
import { toSafeWebhookError } from "../src/channels/webhook/webhook-safe-error";

describe("P6 webhook hardening policy", () => {
  it("requires WhatsApp provider verification fail-closed controls", () => {
    const policy = getWebhookVerificationPolicy("whatsapp");

    expect(policy).toMatchObject({
      requiresProviderSignature: true,
      requiresProviderVerifyToken: true,
      acceptsUnauthenticatedPost: true,
    });
  });

  it("keeps webchat and extension webhook boundaries explicit", () => {
    expect(getWebhookVerificationPolicy("webchat")).toMatchObject({
      requiresPublicChannelKey: true,
      requiresClaraAuth: false,
    });
    expect(getWebhookVerificationPolicy("extension")).toMatchObject({
      requiresClaraAuth: true,
      acceptsUnauthenticatedPost: false,
    });
  });

  it("rejects unsupported provider webhooks safely", () => {
    expect(() => assertSupportedWebhookProvider("instagram")).toThrow(
      AuthorizationError,
    );
  });

  it("returns safe webhook errors without sensitive payload details", () => {
    const error = toSafeWebhookError("invalid_signature");
    const serialized = JSON.stringify(error);

    expect(error.safeReasonCode).toBe("invalid_signature");
    expect(serialized).not.toContain("access_token");
    expect(serialized).not.toContain("refresh_token");
    expect(serialized).not.toContain("Authorization");
    expect(serialized).not.toContain("raw provider payload");
  });
});
