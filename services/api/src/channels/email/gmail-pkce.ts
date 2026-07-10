import { createHash, randomBytes } from "node:crypto";

export const gmailPkceCodeChallengeMethods = ["S256"] as const;

export type GmailPkceCodeChallengeMethod =
  (typeof gmailPkceCodeChallengeMethods)[number];

function toBase64Url(input: Buffer): string {
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function generateRandomBase64Url(bytes = 32): string {
  return toBase64Url(randomBytes(bytes));
}

export function sha256Base64Url(input: string): string {
  return toBase64Url(createHash("sha256").update(input, "utf8").digest());
}

export function generateGmailPkcePair(): {
  codeVerifier: string;
  codeChallenge: string;
  codeChallengeMethod: GmailPkceCodeChallengeMethod;
} {
  const codeVerifier = generateRandomBase64Url(48);

  return {
    codeVerifier,
    codeChallenge: sha256Base64Url(codeVerifier),
    codeChallengeMethod: "S256",
  };
}
