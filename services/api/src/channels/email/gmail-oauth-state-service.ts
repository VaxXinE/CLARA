import {
  AuthorizationError,
  ConflictError,
  NotFoundError,
} from "../../errors/app-error";
import type { GmailProviderConfig } from "./gmail-provider-config";
import { validateGmailProviderConfig } from "./gmail-provider-config";
import type { GmailTokenEncryptionKey } from "./gmail-token-encryption";
import {
  decodeGmailTokenEncryptionKey,
  decryptGmailSecretValue,
  encryptGmailSecretValue,
} from "./gmail-token-encryption";
import {
  generateGmailPkcePair,
  generateRandomBase64Url,
  sha256Base64Url,
} from "./gmail-pkce";
import type {
  GmailOAuthConnectIntent,
  GmailOAuthConsumeResult,
  GmailOAuthStateEntry,
  GmailOAuthStateMetadata,
} from "./gmail-oauth-state-types";
import {
  buildGmailOAuthStateEntry,
  normalizeOAuthScopes,
} from "./gmail-oauth-state-types";
import {
  FixtureGmailOAuthStateRepository,
  type GmailOAuthStateRepository,
} from "./gmail-oauth-state-repository";

type AllowedActorRole = "owner" | "agent" | "viewer";

function assertAllowedActorRole(role: AllowedActorRole): void {
  if (role === "viewer") {
    throw new AuthorizationError(
      "You do not have permission to initiate a Gmail provider connection.",
    );
  }
}

function assertAllowedRedirectUri(
  config: GmailProviderConfig,
  redirectUri: string,
): string {
  const normalized = redirectUri.trim();
  const allowlist = config.oauthAllowedRedirectUris ?? [];

  if (!allowlist.includes(normalized)) {
    throw new ConflictError("Gmail OAuth redirect URI is not allowed.");
  }

  return normalized;
}

export class GmailOAuthStateService {
  private readonly encryptionKey: GmailTokenEncryptionKey;
  private readonly defaultTtlMs: number;

  constructor(
    private readonly repository: GmailOAuthStateRepository = new FixtureGmailOAuthStateRepository(),
    private readonly config: GmailProviderConfig,
    options?: {
      nodeEnv?: "development" | "test" | "production";
      defaultTtlMs?: number;
    },
  ) {
    validateGmailProviderConfig(config, {
      nodeEnv: options?.nodeEnv ?? "development",
    });
    this.encryptionKey = decodeGmailTokenEncryptionKey({
      keyVersion: config.tokenEncryptionKeyVersion ?? "v1",
      keyBase64: config.tokenEncryptionKeyBase64 ?? "",
    });
    this.defaultTtlMs = options?.defaultTtlMs ?? 10 * 60 * 1000;
  }

  async createConnectIntent(input: {
    organizationId: string;
    workspaceId: string;
    actorUserId: string;
    actorRole: AllowedActorRole;
    redirectUri: string;
    scopes: string[];
    metadata?: GmailOAuthStateMetadata;
    now?: Date;
  }): Promise<GmailOAuthConnectIntent> {
    assertAllowedActorRole(input.actorRole);
    const now = input.now ?? new Date();
    const expiresAt = new Date(now.getTime() + this.defaultTtlMs);
    const redirectUri = assertAllowedRedirectUri(
      this.config,
      input.redirectUri,
    );
    const state = generateRandomBase64Url(32);
    const nonce = generateRandomBase64Url(32);
    const stateHash = sha256Base64Url(state);
    const nonceHash = sha256Base64Url(nonce);
    const pkce = generateGmailPkcePair();
    const encryptedVerifier = encryptGmailSecretValue(
      pkce.codeVerifier,
      this.encryptionKey,
    );
    const entry = buildGmailOAuthStateEntry({
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      actorUserId: input.actorUserId,
      stateHash,
      nonceHash,
      pkceVerifierCiphertext: encryptedVerifier.ciphertext,
      pkceVerifierIv: encryptedVerifier.iv,
      pkceVerifierAuthTag: encryptedVerifier.authTag,
      pkceKeyVersion: encryptedVerifier.keyVersion,
      codeChallenge: pkce.codeChallenge,
      codeChallengeMethod: pkce.codeChallengeMethod,
      redirectUri,
      scopes: normalizeOAuthScopes(input.scopes),
      expiresAt,
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    });

    const created = await this.repository.createEntry(entry);

    return {
      id: created.id,
      provider: created.provider,
      state,
      codeChallenge: created.codeChallenge,
      codeChallengeMethod: created.codeChallengeMethod,
      redirectUri: created.redirectUri,
      scopes: [...created.scopes],
      expiresAt: created.expiresAt,
    };
  }

  async consumeConnectIntent(input: {
    organizationId: string;
    workspaceId: string;
    state: string;
    now?: Date;
  }): Promise<GmailOAuthConsumeResult> {
    const now = input.now ?? new Date();
    const entry = await this.repository.findByStateHashScoped(
      {
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
      },
      sha256Base64Url(input.state),
    );

    if (!entry) {
      throw new NotFoundError("Gmail OAuth state not found.");
    }

    if (entry.status === "consumed") {
      throw new ConflictError("Gmail OAuth state has already been consumed.");
    }

    if (entry.status === "revoked") {
      throw new ConflictError("Gmail OAuth state has been revoked.");
    }

    if (entry.expiresAt.getTime() <= now.getTime()) {
      await this.repository.updateEntry({
        scope: {
          organizationId: entry.organizationId,
          workspaceId: entry.workspaceId,
        },
        entryId: entry.id,
        status: "expired",
        updatedAt: now,
      });

      throw new ConflictError("Gmail OAuth state has expired.");
    }

    const updated = await this.repository.updateEntry({
      scope: {
        organizationId: entry.organizationId,
        workspaceId: entry.workspaceId,
      },
      entryId: entry.id,
      status: "consumed",
      consumedAt: now,
      updatedAt: now,
    });

    if (!updated) {
      throw new NotFoundError("Gmail OAuth state not found.");
    }

    const pkceCodeVerifier = decryptGmailSecretValue(
      {
        ciphertext: updated.pkceVerifierCiphertext,
        iv: updated.pkceVerifierIv,
        authTag: updated.pkceVerifierAuthTag,
        keyVersion: updated.pkceKeyVersion,
      },
      this.encryptionKey,
    );

    return {
      entry: updated,
      pkceCodeVerifier,
    };
  }

  async revokeConnectIntent(input: {
    organizationId: string;
    workspaceId: string;
    state: string;
    now?: Date;
  }): Promise<GmailOAuthStateEntry> {
    const now = input.now ?? new Date();
    const entry = await this.repository.findByStateHashScoped(
      {
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
      },
      sha256Base64Url(input.state),
    );

    if (!entry) {
      throw new NotFoundError("Gmail OAuth state not found.");
    }

    const updated = await this.repository.updateEntry({
      scope: {
        organizationId: entry.organizationId,
        workspaceId: entry.workspaceId,
      },
      entryId: entry.id,
      status: "revoked",
      revokedAt: now,
      updatedAt: now,
    });

    if (!updated) {
      throw new NotFoundError("Gmail OAuth state not found.");
    }

    return updated;
  }
}
