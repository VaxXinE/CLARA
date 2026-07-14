import { describe, expect, it } from "vitest";
import { channelCapabilities } from "../src/channels/channel-capabilities";
import { sanitizeMultichannelAuditMetadata } from "../src/audit/multichannel-audit-policy";
import { buildChannelOperationalSignal } from "../src/channels/observability/channel-observability-policy";
import { sanitizeProviderChannelAuditMetadata } from "../src/audit/provider-channel-audit-policy";
import { assertSupportedWebhookProvider } from "../src/channels/webhook/webhook-hardening-policy";
import {
  beginOutboundSend,
  completeOutboundAttempt,
} from "../src/channels/outbound/outbound-delivery-lifecycle";

function expectSafe(value: unknown): void {
  const serialized = JSON.stringify(value);

  expect(serialized).not.toContain("access_token");
  expect(serialized).not.toContain("refresh_token");
  expect(serialized).not.toContain("Authorization");
  expect(serialized).not.toContain("providerCookie");
  expect(serialized).not.toContain("sessionCookie");
  expect(serialized).not.toContain("rawProviderPayload");
  expect(serialized).not.toContain("raw_provider_payload");
  expect(serialized).not.toContain("rawDom");
  expect(serialized).not.toContain("rawHtml");
}

describe("P6 final security audit", () => {
  it("keeps official provider policy and planned social providers bounded", () => {
    const instagram = channelCapabilities.find(
      (item) => item.provider === "instagram",
    );
    const tiktok = channelCapabilities.find(
      (item) => item.provider === "tiktok",
    );

    expect(instagram?.production_status).toBe("planned");
    expect(tiktok?.production_status).toBe("planned");
    expect(instagram?.safe_notes).toContain("official");
    expect(tiktok?.safe_notes).toContain("official");
  });

  it("keeps unsupported webhooks fail-closed", () => {
    expect(() => assertSupportedWebhookProvider("tiktok")).toThrow();
  });

  it("keeps outbound lifecycle bounded against infinite retry", () => {
    expect(beginOutboundSend("queued")).toEqual({ status: "sending" });
    expect(
      completeOutboundAttempt({
        succeeded: false,
        attemptNumber: 3,
        maxAttempts: 3,
        failureKind: "transient",
      }),
    ).toMatchObject({
      status: "dead_letter",
      safeReasonCode: "max_attempts_exceeded",
    });
  });

  it("keeps observability and audit policies sanitized", () => {
    const observability = buildChannelOperationalSignal({
      channel: "email",
      provider: "gmail",
      workspaceId: "wks_1",
      status: "connected",
      readinessLevel: "production",
      safeReasonCode: "connected",
      correlationId: "corr_1",
    });
    const audit = sanitizeProviderChannelAuditMetadata({
      provider: "gmail",
      status: "connected",
      access_token: "atk",
      refresh_token: "rtk",
      raw_provider_payload: "unsafe",
    });
    const legacyAudit = sanitizeMultichannelAuditMetadata({
      provider: "gmail",
      status: "connected",
      access_token: "atk",
      raw_provider_payload: "unsafe",
    });

    expectSafe(observability);
    expectSafe(audit);
    expectSafe(legacyAudit);
  });
});
