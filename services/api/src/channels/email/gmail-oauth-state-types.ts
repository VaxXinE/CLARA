import { randomUUID } from "node:crypto";

export const gmailOAuthStateProviders = ["gmail"] as const;
export const gmailOAuthStateStatuses = [
  "pending",
  "consumed",
  "expired",
  "revoked",
] as const;
export const gmailOAuthCodeChallengeMethods = ["S256"] as const;

export type GmailOAuthStateProvider = (typeof gmailOAuthStateProviders)[number];
export type GmailOAuthStateStatus = (typeof gmailOAuthStateStatuses)[number];
export type GmailOAuthCodeChallengeMethod =
  (typeof gmailOAuthCodeChallengeMethods)[number];

export type GmailOAuthStateMetadata = {
  connectionOrigin?: "manual" | "test";
};

export type GmailOAuthStateEntry = {
  id: string;
  organizationId: string;
  workspaceId: string;
  actorUserId: string;
  provider: GmailOAuthStateProvider;
  stateHash: string;
  nonceHash: string | null;
  pkceVerifierCiphertext: string;
  pkceVerifierIv: string;
  pkceVerifierAuthTag: string;
  pkceKeyVersion: string;
  codeChallenge: string;
  codeChallengeMethod: GmailOAuthCodeChallengeMethod;
  redirectUri: string;
  scopes: string[];
  status: GmailOAuthStateStatus;
  expiresAt: Date;
  consumedAt: Date | null;
  revokedAt: Date | null;
  metadata: GmailOAuthStateMetadata;
  createdAt: Date;
  updatedAt: Date;
};

export type GmailOAuthConnectIntent = {
  id: string;
  provider: GmailOAuthStateProvider;
  state: string;
  codeChallenge: string;
  codeChallengeMethod: GmailOAuthCodeChallengeMethod;
  redirectUri: string;
  scopes: string[];
  expiresAt: Date;
};

export type GmailOAuthConsumeResult = {
  entry: GmailOAuthStateEntry;
  pkceCodeVerifier: string;
};

function normalizeSingleLine(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function sanitizeGmailOAuthStateMetadata(
  metadata: GmailOAuthStateMetadata | undefined,
): GmailOAuthStateMetadata {
  const safeMetadata: GmailOAuthStateMetadata = {};

  if (
    metadata?.connectionOrigin === "manual" ||
    metadata?.connectionOrigin === "test"
  ) {
    safeMetadata.connectionOrigin = metadata.connectionOrigin;
  }

  return safeMetadata;
}

export function normalizeOAuthScopes(scopes: string[]): string[] {
  return [
    ...new Set(
      scopes.map((scope) => normalizeSingleLine(scope)).filter(Boolean),
    ),
  ].sort();
}

export function buildGmailOAuthStateEntry(
  input: Omit<
    GmailOAuthStateEntry,
    | "id"
    | "provider"
    | "status"
    | "consumedAt"
    | "revokedAt"
    | "createdAt"
    | "updatedAt"
  > & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
  },
): GmailOAuthStateEntry {
  const createdAt = input.createdAt ?? new Date();

  return {
    id: input.id ?? `gmail_oauth_state_${randomUUID()}`,
    organizationId: normalizeSingleLine(input.organizationId),
    workspaceId: normalizeSingleLine(input.workspaceId),
    actorUserId: normalizeSingleLine(input.actorUserId),
    provider: "gmail",
    stateHash: normalizeSingleLine(input.stateHash),
    nonceHash: input.nonceHash ? normalizeSingleLine(input.nonceHash) : null,
    pkceVerifierCiphertext: normalizeSingleLine(input.pkceVerifierCiphertext),
    pkceVerifierIv: normalizeSingleLine(input.pkceVerifierIv),
    pkceVerifierAuthTag: normalizeSingleLine(input.pkceVerifierAuthTag),
    pkceKeyVersion: normalizeSingleLine(input.pkceKeyVersion),
    codeChallenge: normalizeSingleLine(input.codeChallenge),
    codeChallengeMethod: input.codeChallengeMethod,
    redirectUri: normalizeSingleLine(input.redirectUri),
    scopes: normalizeOAuthScopes(input.scopes),
    status: "pending",
    expiresAt: input.expiresAt,
    consumedAt: null,
    revokedAt: null,
    metadata: sanitizeGmailOAuthStateMetadata(input.metadata),
    createdAt,
    updatedAt: input.updatedAt ?? createdAt,
  };
}
