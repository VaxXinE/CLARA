import { describe, expect, it } from "vitest";
import { hasGmailCredentialLeak } from "../src/channels/email/gmail-credential-boundary-policy";

describe("P6 Gmail credential boundary", () => {
  it("allows safe Gmail channel health fields", () => {
    expect(
      hasGmailCredentialLeak({
        provider: "gmail",
        status: "connected",
        safeReasonCode: "connected",
        nextRecommendedAction: "No action required.",
      }),
    ).toBe(false);
  });

  it("detects credential and raw provider payload fields", () => {
    expect(
      hasGmailCredentialLeak({
        provider: "gmail",
        nested: {
          access_token: "atk",
        },
      }),
    ).toBe(true);
    expect(
      hasGmailCredentialLeak({
        raw_provider_payload: {
          body: "unsafe",
        },
      }),
    ).toBe(true);
    expect(
      hasGmailCredentialLeak({
        Authorization: "Bearer atk",
      }),
    ).toBe(true);
  });
});
