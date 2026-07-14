import { describe, expect, it } from "vitest";
import {
  providerChannelAuditEventTypes,
  sanitizeProviderChannelAuditMetadata,
} from "../src/audit/provider-channel-audit-policy";

describe("P6 provider channel audit policy", () => {
  it("defines the provider/channel audit trail taxonomy", () => {
    expect(providerChannelAuditEventTypes).toEqual(
      expect.arrayContaining([
        "provider_account_connected",
        "provider_account_disconnected",
        "provider_account_reconnect_required",
        "provider_token_refresh_failed_safe",
        "channel_health_checked",
        "webhook_received_safe",
        "webhook_rejected_safe",
        "webhook_replay_detected",
        "outbound_queued",
        "outbound_sending",
        "outbound_sent",
        "outbound_retry_scheduled",
        "outbound_dead_lettered",
        "provider_policy_blocked",
        "extension_snapshot_received_safe",
        "extension_snapshot_rejected_safe",
      ]),
    );
  });

  it("keeps audit metadata allowlisted and sanitized", () => {
    const metadata = sanitizeProviderChannelAuditMetadata({
      provider: "whatsapp",
      channel: "chat",
      account_id: "acct_1",
      outbound_delivery_id: "del_1",
      retry_count: 2,
      dead_letter_count: 1,
      access_token: "atk",
      refresh_token: "rtk",
      authorization_header: "Bearer atk",
      cookie: "sid=abc",
      raw_provider_payload: { unsafe: true },
      raw_webhook_body: { unsafe: true },
      raw_email_body: "customer body",
      raw_dom: "<main>unsafe</main>",
      raw_html: "<script>x</script>",
      provider_raw_error: "provider internals",
    });
    const serialized = JSON.stringify(metadata);

    expect(metadata).toEqual({
      provider: "whatsapp",
      channel: "chat",
      account_id: "acct_1",
      outbound_delivery_id: "del_1",
      retry_count: 2,
      dead_letter_count: 1,
    });
    expect(serialized).not.toContain("atk");
    expect(serialized).not.toContain("rtk");
    expect(serialized).not.toContain("Bearer");
    expect(serialized).not.toContain("customer body");
    expect(serialized).not.toContain("provider internals");
  });
});
