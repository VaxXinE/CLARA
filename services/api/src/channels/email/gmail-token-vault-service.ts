import { randomUUID } from "node:crypto";
import type { GmailProviderConfig } from "./gmail-provider-config";
import { validateGmailProviderConfig } from "./gmail-provider-config";
import {
  decodeGmailTokenEncryptionKey,
  decryptGmailTokenPlaintext,
  encryptGmailTokenPlaintext,
  type GmailTokenEncryptionKey,
} from "./gmail-token-encryption";
import type { DrizzleGmailTokenVaultRepository } from "./gmail-token-vault-db-repository";
import type {
  GetGmailTokenReferenceInput,
  GmailStoredTokenReference,
  GmailTokenVault,
  RevokeGmailTokenReferenceInput,
  StoreGmailTokenReferenceInput,
} from "./gmail-token-vault";
import {
  sanitizeGmailTokenVaultMetadata,
} from "./gmail-token-vault";

export class EncryptedGmailTokenVaultService implements GmailTokenVault {
  private readonly encryptionKey: GmailTokenEncryptionKey;

  constructor(
    private readonly repository: DrizzleGmailTokenVaultRepository,
    config: GmailProviderConfig,
    options?: {
      nodeEnv?: "development" | "test" | "production";
    },
  ) {
    validateGmailProviderConfig(config, {
      nodeEnv: options?.nodeEnv ?? "development",
    });
    this.encryptionKey = decodeGmailTokenEncryptionKey({
      keyVersion: config.tokenEncryptionKeyVersion ?? "v1",
      keyBase64: config.tokenEncryptionKeyBase64 ?? "",
    });
  }

  async storeTokenReference(
    input: StoreGmailTokenReferenceInput,
  ): Promise<{
    referenceId: string;
    provider: "gmail";
    keyVersion: string;
    createdAt: Date;
  }> {
    const createdAt = new Date();
    const referenceId = `gmail_token_ref_${randomUUID()}`;
    const metadata = sanitizeGmailTokenVaultMetadata({
      ...input.metadata,
      scopes: [...input.scopes, ...(input.metadata?.scopes ?? [])],
    });
    const encrypted = encryptGmailTokenPlaintext(
      {
        accessToken: input.tokenGrant.accessToken,
        refreshToken: input.tokenGrant.refreshToken,
        expiresAt: input.tokenGrant.expiresAt?.toISOString() ?? null,
      },
      this.encryptionKey,
    );

    await this.repository.createEntry({
      id: referenceId,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      providerAccountId: input.accountId,
      provider: "gmail",
      tokenPurpose: input.tokenPurpose ?? "oauth_grant",
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      keyVersion: encrypted.keyVersion,
      expiresAt: input.tokenGrant.expiresAt,
      revokedAt: null,
      metadata,
      createdAt,
      updatedAt: createdAt,
    });

    return {
      referenceId,
      provider: "gmail",
      keyVersion: encrypted.keyVersion,
      createdAt,
    };
  }

  async getTokenReference(
    input: GetGmailTokenReferenceInput,
  ): Promise<GmailStoredTokenReference | null> {
    const row = await this.repository.findByReferenceScoped(
      {
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
      },
      input.referenceId,
    );

    if (!row || row.revokedAt !== null) {
      return null;
    }

    const plaintext = decryptGmailTokenPlaintext(
      {
        ciphertext: row.ciphertext,
        iv: row.iv,
        authTag: row.authTag,
        keyVersion: row.keyVersion,
      },
      this.encryptionKey,
    );

    return {
      referenceId: row.id,
      provider: "gmail",
      organizationId: row.organizationId,
      workspaceId: row.workspaceId,
      accountId: row.providerAccountId ?? null,
      tokenPurpose: row.tokenPurpose,
      keyVersion: row.keyVersion,
      scopes: row.metadata.scopes ?? [],
      accessToken: plaintext.accessToken,
      refreshToken: plaintext.refreshToken,
      expiresAt:
        plaintext.expiresAt === null ? null : new Date(plaintext.expiresAt),
      revokedAt: row.revokedAt,
      metadata: row.metadata,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  async revokeTokenReference(
    input: RevokeGmailTokenReferenceInput,
  ): Promise<void> {
    await this.repository.revokeEntry({
      scope: {
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
      },
      referenceId: input.referenceId,
      revokedAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
