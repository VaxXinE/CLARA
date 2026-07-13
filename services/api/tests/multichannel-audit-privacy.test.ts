import { describe, expect, it } from "vitest";
import {
  multichannelAuditMetadataAllowlist,
  multichannelAuditProviders,
  sanitizeMultichannelAuditMetadata,
} from "../src/audit/multichannel-audit-policy";

describe("multichannel audit privacy policy", () => {
  it("allowlists only safe metadata for current and future channels", () => {
    expect(multichannelAuditProviders).toEqual([
      "gmail",
      "email",
      "webchat",
      "whatsapp",
      "instagram",
      "tiktok",
      "extension",
    ]);
    expect(multichannelAuditMetadataAllowlist).toEqual(
      expect.arrayContaining([
        "provider",
        "channel_account_id",
        "conversation_id",
        "delivery_id",
        "reason_code",
        "status",
        "direction",
        "correlation_id",
        "recipient_count",
      ]),
    );
  });

  it("strips token, secret, raw payload, cookie, header, and body fields", () => {
    const metadata = sanitizeMultichannelAuditMetadata({
      provider: "whatsapp",
      conversation_id: "conv_demo",
      status: "simulated",
      recipient_count: 1,
      access_token: "atk",
      refresh_token: "rtk",
      webhook_verification_token: "wvt",
      oauth_client_secret: "ocs",
      authorization_header: "Bearer atk",
      cookie: "sid=abc",
      raw_provider_payload: { unsafe: true },
      raw_provider_error: "provider internals",
      message_body: "customer text",
      unsafe_html: "<script>x</script>",
      full_phone_contact_payload: "+62000000000",
    });
    const serialized = JSON.stringify(metadata);

    expect(metadata).toEqual({
      provider: "whatsapp",
      conversation_id: "conv_demo",
      status: "simulated",
      recipient_count: 1,
    });
    expect(serialized).not.toContain("atk");
    expect(serialized).not.toContain("rtk");
    expect(serialized).not.toContain("Bearer");
    expect(serialized).not.toContain("provider internals");
    expect(serialized).not.toContain("customer text");
    expect(serialized).not.toContain("<script>");
  });
});
