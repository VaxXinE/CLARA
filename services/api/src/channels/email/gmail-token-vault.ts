import { AppError, NotFoundError } from "../../errors/app-error";
import type { GmailTokenGrant } from "./gmail-auth-types";

export const gmailTokenPurposes = ["oauth_grant"] as const;

export type GmailTokenPurpose = (typeof gmailTokenPurposes)[number];

export type GmailTokenVaultMetadata = {
  scopes?: string[];
  refreshedAt?: string;
  accessTokenExpiresAt?: string;
};

export type GmailStoredTokenReference = {
  referenceId: string;
  provider: "gmail";
  organizationId: string;
  workspaceId: string;
  accountId: string | null;
  tokenPurpose: GmailTokenPurpose;
  keyVersion: string;
  scopes: string[];
  accessToken: string;
  refreshToken: string;
  expiresAt: Date | null;
  revokedAt: Date | null;
  metadata: GmailTokenVaultMetadata;
  createdAt: Date;
  updatedAt: Date;
};

export type StoreGmailTokenReferenceInput = {
  organizationId: string;
  workspaceId: string;
  accountId: string;
  scopes: string[];
  tokenGrant: GmailTokenGrant;
  tokenPurpose?: GmailTokenPurpose;
  metadata?: GmailTokenVaultMetadata;
};

export type GetGmailTokenReferenceInput = {
  organizationId: string;
  workspaceId: string;
  referenceId: string;
};

export type RevokeGmailTokenReferenceInput = GetGmailTokenReferenceInput;

export interface GmailTokenVault {
  storeTokenReference(input: StoreGmailTokenReferenceInput): Promise<{
    referenceId: string;
    provider: "gmail";
    keyVersion: string;
    createdAt: Date;
  }>;

  getTokenReference(
    input: GetGmailTokenReferenceInput,
  ): Promise<GmailStoredTokenReference | null>;

  revokeTokenReference(input: RevokeGmailTokenReferenceInput): Promise<void>;
}

export function assertScopedTokenReference(
  tokenReference: GmailStoredTokenReference | null,
  input: GetGmailTokenReferenceInput,
): GmailStoredTokenReference {
  if (!tokenReference) {
    throw new NotFoundError("Gmail token reference not found.");
  }

  if (
    tokenReference.organizationId !== input.organizationId ||
    tokenReference.workspaceId !== input.workspaceId
  ) {
    throw new AppError({
      statusCode: 403,
      appCode: "GMAIL_TOKEN_SCOPE_MISMATCH",
      message: "Gmail token reference scope mismatch.",
    });
  }

  return tokenReference;
}

export function sanitizeGmailTokenVaultMetadata(
  metadata: GmailTokenVaultMetadata | undefined,
): GmailTokenVaultMetadata {
  const safeMetadata: GmailTokenVaultMetadata = {};

  if (Array.isArray(metadata?.scopes)) {
    safeMetadata.scopes = [
      ...new Set(
        metadata.scopes
          .map((scope) => scope.trim())
          .filter((scope) => scope.length > 0),
      ),
    ].sort();
  }

  if (
    typeof metadata?.refreshedAt === "string" &&
    metadata.refreshedAt.trim().length > 0 &&
    metadata.refreshedAt.trim().length <= 255
  ) {
    safeMetadata.refreshedAt = metadata.refreshedAt.trim();
  }

  if (
    typeof metadata?.accessTokenExpiresAt === "string" &&
    metadata.accessTokenExpiresAt.trim().length > 0 &&
    metadata.accessTokenExpiresAt.trim().length <= 255
  ) {
    safeMetadata.accessTokenExpiresAt = metadata.accessTokenExpiresAt.trim();
  }

  return safeMetadata;
}
