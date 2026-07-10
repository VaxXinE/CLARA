import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { AppError } from "../../errors/app-error";

const GMAIL_TOKEN_ENCRYPTION_ALGORITHM = "aes-256-gcm";
const GMAIL_TOKEN_ENCRYPTION_KEY_BYTES = 32;
const GMAIL_TOKEN_ENCRYPTION_IV_BYTES = 12;

export type GmailTokenEncryptionKey = {
  keyVersion: string;
  keyMaterial: Buffer;
};

export type GmailEncryptedTokenPayload = {
  ciphertext: string;
  iv: string;
  authTag: string;
  keyVersion: string;
};

export type GmailTokenPlaintext = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string | null;
};

function failClosed(message: string): never {
  throw new AppError({
    statusCode: 500,
    appCode: "GMAIL_TOKEN_VAULT_ENCRYPTION_ERROR",
    message,
  });
}

export function decodeGmailTokenEncryptionKey(input: {
  keyVersion: string;
  keyBase64: string;
}): GmailTokenEncryptionKey {
  const keyVersion = input.keyVersion.trim();

  if (keyVersion.length === 0) {
    throw new Error(
      "Invalid Gmail token vault encryption configuration: key version must not be empty.",
    );
  }

  const keyMaterial = Buffer.from(input.keyBase64, "base64");

  if (keyMaterial.length !== GMAIL_TOKEN_ENCRYPTION_KEY_BYTES) {
    throw new Error(
      "Invalid Gmail token vault encryption configuration: key must decode to exactly 32 bytes for AES-256-GCM.",
    );
  }

  const normalized = keyMaterial.toString("base64");

  if (normalized !== input.keyBase64.trim()) {
    throw new Error(
      "Invalid Gmail token vault encryption configuration: key must be valid base64 without extra characters.",
    );
  }

  return {
    keyVersion,
    keyMaterial,
  };
}

export function encryptGmailTokenPlaintext(
  plaintext: GmailTokenPlaintext,
  key: GmailTokenEncryptionKey,
): GmailEncryptedTokenPayload {
  const iv = randomBytes(GMAIL_TOKEN_ENCRYPTION_IV_BYTES);
  const cipher = createCipheriv(
    GMAIL_TOKEN_ENCRYPTION_ALGORITHM,
    key.keyMaterial,
    iv,
  );
  const serialized = JSON.stringify(plaintext);
  const ciphertext = Buffer.concat([
    cipher.update(serialized, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
    keyVersion: key.keyVersion,
  };
}

export function decryptGmailTokenPlaintext(
  payload: GmailEncryptedTokenPayload,
  key: GmailTokenEncryptionKey,
): GmailTokenPlaintext {
  const payloadKeyVersion = Buffer.from(payload.keyVersion, "utf8");
  const expectedKeyVersion = Buffer.from(key.keyVersion, "utf8");

  if (
    payloadKeyVersion.length !== expectedKeyVersion.length ||
    !timingSafeEqual(payloadKeyVersion, expectedKeyVersion)
  ) {
    return failClosed(
      "Gmail token vault key version mismatch. Token decryption failed closed.",
    );
  }

  try {
    const decipher = createDecipheriv(
      GMAIL_TOKEN_ENCRYPTION_ALGORITHM,
      key.keyMaterial,
      Buffer.from(payload.iv, "base64"),
    );
    decipher.setAuthTag(Buffer.from(payload.authTag, "base64"));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(payload.ciphertext, "base64")),
      decipher.final(),
    ]).toString("utf8");
    const parsed = JSON.parse(plaintext) as Partial<GmailTokenPlaintext>;

    if (
      typeof parsed.accessToken !== "string" ||
      parsed.accessToken.trim().length === 0 ||
      typeof parsed.refreshToken !== "string" ||
      parsed.refreshToken.trim().length === 0
    ) {
      return failClosed(
        "Gmail token vault plaintext is invalid. Token decryption failed closed.",
      );
    }

    if (
      parsed.expiresAt !== null &&
      parsed.expiresAt !== undefined &&
      typeof parsed.expiresAt !== "string"
    ) {
      return failClosed(
        "Gmail token vault plaintext expiry is invalid. Token decryption failed closed.",
      );
    }

    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
      expiresAt: parsed.expiresAt ?? null,
    };
  } catch {
    return failClosed(
      "Gmail token vault decryption failed closed. Token material could not be read safely.",
    );
  }
}
