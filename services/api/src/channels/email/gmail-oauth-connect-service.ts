import { assertPermission } from "../../auth/permissions";
import type { AuthContext } from "../../auth/auth-context";
import { ConflictError } from "../../errors/app-error";
import type { GmailProviderConfig } from "./gmail-provider-config";
import { validateGmailProviderConfig } from "./gmail-provider-config";
import type { GmailOAuthConnectResponse } from "./gmail-oauth-connect-types";
import type { GmailOAuthStateService } from "./gmail-oauth-state-service";

const gmailOAuthScopeMap = {
  "gmail.readonly": "https://www.googleapis.com/auth/gmail.readonly",
  "gmail.send": "https://www.googleapis.com/auth/gmail.send",
} as const;

type GmailOAuthScopeAlias = keyof typeof gmailOAuthScopeMap;

function normalizeScopes(scopes: string[]): GmailOAuthScopeAlias[] {
  return [
    ...new Set(scopes.map((scope) => scope.trim()).filter(Boolean)),
  ].sort() as GmailOAuthScopeAlias[];
}

export class GmailOAuthConnectService {
  constructor(
    private readonly oauthStateService: GmailOAuthStateService,
    private readonly config: GmailProviderConfig,
    options?: {
      nodeEnv?: "development" | "test" | "production";
    },
  ) {
    validateGmailProviderConfig(config, {
      nodeEnv: options?.nodeEnv ?? "development",
    });
  }

  async createAuthorizationUrl(input: {
    auth: AuthContext;
    redirectUri?: string;
    scopes?: string[];
  }): Promise<GmailOAuthConnectResponse> {
    assertPermission(input.auth.role, "integration:gmail_connect");

    const redirectUri = (
      input.redirectUri ??
      this.config.oauthRedirectUri ??
      ""
    ).trim();
    const requestedScopes = normalizeScopes(
      input.scopes && input.scopes.length > 0
        ? input.scopes
        : this.config.oauthAllowedScopes,
    );
    const allowedScopes = new Set(
      this.config.oauthAllowedScopes as GmailOAuthScopeAlias[],
    );

    if (!(this.config.oauthAllowedRedirectUris ?? []).includes(redirectUri)) {
      throw new ConflictError("Gmail OAuth redirect URI is not allowed.");
    }

    if (
      requestedScopes.length === 0 ||
      requestedScopes.some((scope) => !allowedScopes.has(scope))
    ) {
      throw new ConflictError("Gmail OAuth scopes are not allowed.");
    }

    const intent = await this.oauthStateService.createConnectIntent({
      organizationId: input.auth.organizationId,
      workspaceId: input.auth.workspaceId,
      actorUserId: input.auth.userId,
      actorRole: input.auth.role,
      redirectUri,
      scopes: requestedScopes,
      metadata: {
        connectionOrigin: "manual",
      },
    });

    const params = new URLSearchParams({
      client_id: this.config.oauthClientId ?? "",
      redirect_uri: redirectUri,
      response_type: "code",
      scope: requestedScopes
        .map((scope) => gmailOAuthScopeMap[scope])
        .join(" "),
      state: intent.state,
      code_challenge: intent.codeChallenge,
      code_challenge_method: intent.codeChallengeMethod,
      access_type: "offline",
      include_granted_scopes: "true",
      prompt: "consent",
    });

    return {
      provider: "gmail",
      authorization_url: `${this.config.oauthAuthorizationEndpoint}?${params.toString()}`,
      scopes: [...requestedScopes],
      expires_at: intent.expiresAt.toISOString(),
      state_expires_at: intent.expiresAt.toISOString(),
    };
  }
}
