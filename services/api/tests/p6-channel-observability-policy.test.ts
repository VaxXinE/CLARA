import { describe, expect, it } from "vitest";
import { buildChannelOperationalSignal } from "../src/channels/observability/channel-observability-policy";
import { sanitizeChannelDiagnostics } from "../src/channels/observability/channel-safe-diagnostics";

describe("P6 channel observability policy", () => {
  it("builds workspace-scoped safe operational signals", () => {
    const signal = buildChannelOperationalSignal({
      channel: "email",
      provider: "gmail",
      workspaceId: "wks_1",
      status: "degraded",
      readinessLevel: "production",
      safeReasonCode: "provider_rate_limited",
      correlationId: "corr_1",
      lastHealthCheckedAt: "2026-07-14T00:00:00.000Z",
      retryCount: 2,
      deadLetterCount: 1,
      webhookAcceptedCount: 10,
      webhookRejectedCount: 1,
      outboundQueuedCount: 3,
      outboundSendingCount: 1,
      outboundSentCount: 8,
      outboundFailedCount: 1,
      outboundRetryingCount: 2,
      outboundDeadLetterCount: 1,
    });

    expect(signal).toMatchObject({
      channel: "email",
      provider: "gmail",
      workspaceId: "wks_1",
      safeReasonCode: "provider_rate_limited",
      correlationId: "corr_1",
      retryCount: 2,
      deadLetterCount: 1,
    });
  });

  it("drops sensitive diagnostics fields", () => {
    const diagnostics = sanitizeChannelDiagnostics({
      provider: "gmail",
      workspaceId: "wks_1",
      status: "connected",
      safeReasonCode: "connected",
      correlationId: "corr_1",
      access_token: "atk",
      refresh_token: "rtk",
      providerCookie: "cookie",
      authorization: "Bearer atk",
      rawProviderPayload: { unsafe: true },
      raw_webhook_payload: { unsafe: true },
      rawHtml: "<script>x</script>",
      provider_raw_error: "provider internals",
    });
    const serialized = JSON.stringify(diagnostics);

    expect(diagnostics).toMatchObject({
      provider: "gmail",
      workspaceId: "wks_1",
      status: "connected",
    });
    expect(serialized).not.toContain("atk");
    expect(serialized).not.toContain("rtk");
    expect(serialized).not.toContain("Bearer");
    expect(serialized).not.toContain("provider internals");
    expect(serialized).not.toContain("<script>");
  });
});
