import { describe, expect, it } from "vitest";
import {
  decodeGmailTokenEncryptionKey,
  decryptGmailTokenPlaintext,
  encryptGmailTokenPlaintext,
} from "../src/channels/email/gmail-token-encryption";

describe("gmail token encryption", () => {
  it("encrypts and decrypts token plaintext through AES-256-GCM", () => {
    const key = decodeGmailTokenEncryptionKey({
      keyVersion: "v1",
      keyBase64: Buffer.alloc(32, 7).toString("base64"),
    });

    const encrypted = encryptGmailTokenPlaintext(
      {
        accessToken: "token_alpha",
        refreshToken: "token_beta",
        expiresAt: "2026-07-10T12:30:00.000Z",
      },
      key,
    );

    expect(encrypted.ciphertext).not.toContain("token_alpha");
    expect(encrypted.ciphertext).not.toContain("token_beta");
    expect(encrypted.keyVersion).toBe("v1");

    const decrypted = decryptGmailTokenPlaintext(encrypted, key);

    expect(decrypted).toEqual({
      accessToken: "token_alpha",
      refreshToken: "token_beta",
      expiresAt: "2026-07-10T12:30:00.000Z",
    });
  });

  it("fails closed for invalid key length", () => {
    expect(() =>
      decodeGmailTokenEncryptionKey({
        keyVersion: "v1",
        keyBase64: Buffer.alloc(16, 1).toString("base64"),
      }),
    ).toThrow("key must decode to exactly 32 bytes");
  });
});
