import { AuthorizationError } from "../../errors/app-error";
import type { WebhookSafeReasonCode } from "./webhook-safe-error";

export type WebhookProvider = "whatsapp" | "webchat" | "extension";

export type WebhookVerificationPolicy = {
  provider: WebhookProvider;
  requiresClaraAuth: boolean;
  requiresProviderSignature: boolean;
  requiresProviderVerifyToken: boolean;
  requiresPublicChannelKey: boolean;
  acceptsUnauthenticatedPost: boolean;
  safeReasonCode: WebhookSafeReasonCode;
};

const POLICIES: Record<WebhookProvider, WebhookVerificationPolicy> = {
  whatsapp: {
    provider: "whatsapp",
    requiresClaraAuth: false,
    requiresProviderSignature: true,
    requiresProviderVerifyToken: true,
    requiresPublicChannelKey: false,
    acceptsUnauthenticatedPost: true,
    safeReasonCode: "invalid_signature",
  },
  webchat: {
    provider: "webchat",
    requiresClaraAuth: false,
    requiresProviderSignature: false,
    requiresProviderVerifyToken: false,
    requiresPublicChannelKey: true,
    acceptsUnauthenticatedPost: true,
    safeReasonCode: "invalid_payload",
  },
  extension: {
    provider: "extension",
    requiresClaraAuth: true,
    requiresProviderSignature: false,
    requiresProviderVerifyToken: false,
    requiresPublicChannelKey: false,
    acceptsUnauthenticatedPost: false,
    safeReasonCode: "webhook_rejected",
  },
};

export function getWebhookVerificationPolicy(
  provider: WebhookProvider,
): WebhookVerificationPolicy {
  return POLICIES[provider];
}

export function assertSupportedWebhookProvider(
  provider: string,
): asserts provider is WebhookProvider {
  if (!(provider in POLICIES)) {
    throw new AuthorizationError("Webhook provider is not supported.");
  }
}
