import { analyticsPolicyVersion } from "./analytics-metric-types";

export const analyticsPrivacyDefaults = {
  aggregated: true,
  rawPayloadIncluded: false,
  piiMinimized: true,
  workspaceScoped: true,
  policyVersion: analyticsPolicyVersion,
} as const;

export const blockedAnalyticsRequestTerms = [
  "token",
  "cookie",
  "authorization",
  "secret",
  "api key",
  "provider payload",
  "webhook payload",
  "customer message",
  "audit metadata",
  "dom",
  "html",
  "prompt",
] as const;

export function containsUnsafeAnalyticsRequest(value: unknown): boolean {
  const text = JSON.stringify(value ?? {}).toLowerCase();

  return blockedAnalyticsRequestTerms.some((term) => text.includes(term));
}
