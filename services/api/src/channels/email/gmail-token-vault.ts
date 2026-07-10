import { AppError, NotFoundError } from "../../errors/app-error";
import type { GmailTokenGrant } from "./gmail-auth-types";

export type GmailStoredTokenReference = {
  referenceId: string;
  provider: "gmail";
  organizationId: string;
  workspaceId: string;
  accountId: string;
  scopes: string[];
  accessToken: string;
  refreshToken: string;
  expiresAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type StoreGmailTokenReferenceInput = {
  organizationId: string;
  workspaceId: string;
  accountId: string;
  scopes: string[];
  tokenGrant: GmailTokenGrant;
};

export type GetGmailTokenReferenceInput = {
  organizationId: string;
  workspaceId: string;
  referenceId: string;
};

export type RevokeGmailTokenReferenceInput = GetGmailTokenReferenceInput;

export interface GmailTokenVault {
  storeTokenReference(
    input: StoreGmailTokenReferenceInput,
  ): Promise<{ referenceId: string; provider: "gmail"; createdAt: Date }>;

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
