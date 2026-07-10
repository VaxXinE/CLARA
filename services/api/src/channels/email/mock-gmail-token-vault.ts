import { randomUUID } from "node:crypto";
import type {
  GetGmailTokenReferenceInput,
  GmailStoredTokenReference,
  GmailTokenVault,
  RevokeGmailTokenReferenceInput,
  StoreGmailTokenReferenceInput,
} from "./gmail-token-vault";
import { sanitizeGmailTokenVaultMetadata } from "./gmail-token-vault";
import type { GmailProviderConfig } from "./gmail-provider-config";
import { validateGmailProviderConfig } from "./gmail-provider-config";

export class MockGmailTokenVault implements GmailTokenVault {
  private readonly tokenReferences = new Map<
    string,
    GmailStoredTokenReference
  >();

  constructor(options?: {
    config?: GmailProviderConfig;
    nodeEnv?: "development" | "test" | "production";
  }) {
    if (options?.config) {
      validateGmailProviderConfig(options.config, {
        nodeEnv: options.nodeEnv ?? "development",
      });
    }
  }

  async storeTokenReference(input: StoreGmailTokenReferenceInput): Promise<{
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

    this.tokenReferences.set(referenceId, {
      referenceId,
      provider: "gmail",
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      tokenPurpose: input.tokenPurpose ?? "oauth_grant",
      keyVersion: "mock-v1",
      scopes: metadata.scopes ?? [],
      accessToken: input.tokenGrant.accessToken,
      refreshToken: input.tokenGrant.refreshToken,
      expiresAt: input.tokenGrant.expiresAt,
      revokedAt: null,
      metadata,
      createdAt,
      updatedAt: createdAt,
    });

    return {
      referenceId,
      provider: "gmail",
      keyVersion: "mock-v1",
      createdAt,
    };
  }

  async getTokenReference(
    input: GetGmailTokenReferenceInput,
  ): Promise<GmailStoredTokenReference | null> {
    const tokenReference = this.tokenReferences.get(input.referenceId);

    if (!tokenReference) {
      return null;
    }

    if (
      tokenReference.organizationId !== input.organizationId ||
      tokenReference.workspaceId !== input.workspaceId ||
      tokenReference.revokedAt !== null
    ) {
      return null;
    }

    return {
      ...tokenReference,
      scopes: [...tokenReference.scopes],
    };
  }

  async revokeTokenReference(
    input: RevokeGmailTokenReferenceInput,
  ): Promise<void> {
    const tokenReference = await this.getTokenReference(input);

    if (!tokenReference) {
      return;
    }

    this.tokenReferences.set(input.referenceId, {
      ...tokenReference,
      revokedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  getDebugSnapshot(): Array<
    Omit<GmailStoredTokenReference, "accessToken" | "refreshToken">
  > {
    return [...this.tokenReferences.values()].map((reference) => ({
      referenceId: reference.referenceId,
      provider: reference.provider,
      organizationId: reference.organizationId,
      workspaceId: reference.workspaceId,
      accountId: reference.accountId,
      tokenPurpose: reference.tokenPurpose,
      keyVersion: reference.keyVersion,
      scopes: [...reference.scopes],
      expiresAt: reference.expiresAt,
      revokedAt: reference.revokedAt,
      metadata: { ...reference.metadata },
      createdAt: reference.createdAt,
      updatedAt: reference.updatedAt,
    }));
  }
}
