import { randomUUID } from "node:crypto";

export const gmailProviderStatuses = [
  "not_connected",
  "connected",
  "revoked",
  "error",
] as const;

export type GmailProvider = "gmail";
export type GmailProviderStatus = (typeof gmailProviderStatuses)[number];

export type GmailProviderAccountMetadata = {
  mailboxType?: "gmail_consumer" | "google_workspace";
  connectionOrigin?: "manual" | "test";
};

export type GmailTokenGrant = {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date | null;
};

export type GmailProviderAccount = {
  id: string;
  organizationId: string;
  workspaceId: string;
  provider: GmailProvider;
  emailAddress: string;
  displayName: string | null;
  status: GmailProviderStatus;
  scopes: string[];
  lastVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tokenReferenceId: string | null;
  metadata: GmailProviderAccountMetadata;
};

export type GmailProviderAccountPublicDto = {
  id: string;
  provider: GmailProvider;
  emailAddress: string;
  displayName: string | null;
  status: GmailProviderStatus;
  scopes: string[];
  lastVerifiedAt: Date | null;
  metadata: GmailProviderAccountMetadata;
};

export type CreateGmailProviderAccountInput = {
  organizationId: string;
  workspaceId: string;
  emailAddress: string;
  displayName?: string | null;
  scopes: string[];
  metadata?: GmailProviderAccountMetadata;
  tokenGrant: GmailTokenGrant;
};

export type RevokeGmailProviderAccountInput = {
  organizationId: string;
  workspaceId: string;
  accountId: string;
};

const basicEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function normalizeSingleLine(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function sanitizeGmailProviderAccountMetadata(
  metadata: GmailProviderAccountMetadata | undefined,
): GmailProviderAccountMetadata {
  const safeMetadata: GmailProviderAccountMetadata = {};

  if (
    metadata?.mailboxType === "gmail_consumer" ||
    metadata?.mailboxType === "google_workspace"
  ) {
    safeMetadata.mailboxType = metadata.mailboxType;
  }

  if (
    metadata?.connectionOrigin === "manual" ||
    metadata?.connectionOrigin === "test"
  ) {
    safeMetadata.connectionOrigin = metadata.connectionOrigin;
  }

  return safeMetadata;
}

function assertValidEmailAddress(value: string): string {
  const normalized = normalizeSingleLine(value).toLowerCase();

  if (!basicEmailPattern.test(normalized)) {
    throw new Error("Gmail provider account requires a valid email address.");
  }

  return normalized;
}

function normalizeScopes(scopes: string[]): string[] {
  return [
    ...new Set(
      scopes.map((scope) => normalizeSingleLine(scope)).filter(Boolean),
    ),
  ].sort();
}

export function buildGmailProviderAccount(
  input: CreateGmailProviderAccountInput & {
    id?: string;
    tokenReferenceId: string;
    createdAt?: Date;
  },
): GmailProviderAccount {
  const createdAt = input.createdAt ?? new Date();

  return {
    id: input.id ?? `gmail_account_${randomUUID()}`,
    organizationId: normalizeSingleLine(input.organizationId),
    workspaceId: normalizeSingleLine(input.workspaceId),
    provider: "gmail",
    emailAddress: assertValidEmailAddress(input.emailAddress),
    displayName: input.displayName
      ? normalizeSingleLine(input.displayName)
      : null,
    status: "connected",
    scopes: normalizeScopes(input.scopes),
    lastVerifiedAt: createdAt,
    createdAt,
    updatedAt: createdAt,
    tokenReferenceId: input.tokenReferenceId,
    metadata: sanitizeGmailProviderAccountMetadata(input.metadata),
  };
}

export function toGmailProviderAccountPublicDto(
  account: GmailProviderAccount,
): GmailProviderAccountPublicDto {
  return {
    id: account.id,
    provider: account.provider,
    emailAddress: account.emailAddress,
    displayName: account.displayName,
    status: account.status,
    scopes: [...account.scopes],
    lastVerifiedAt: account.lastVerifiedAt,
    metadata: sanitizeGmailProviderAccountMetadata(account.metadata),
  };
}
