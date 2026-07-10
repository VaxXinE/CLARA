import { describe, expect, it } from "vitest";
import {
  generateGmailPkcePair,
  sha256Base64Url,
} from "../src/channels/email/gmail-pkce";

describe("gmail pkce", () => {
  it("generates an S256 code challenge from the verifier", () => {
    const pkce = generateGmailPkcePair();

    expect(pkce.codeChallengeMethod).toBe("S256");
    expect(pkce.codeVerifier.length).toBeGreaterThan(40);
    expect(pkce.codeChallenge).toBe(sha256Base64Url(pkce.codeVerifier));
  });
});
