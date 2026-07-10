import type { GmailProviderConfig } from "./gmail-provider-config";
import { validateGmailProviderConfig } from "./gmail-provider-config";
import type { GmailOAuthTokenExchangeClient } from "./gmail-oauth-token-exchange-client";
import {
  GmailOAuthTokenExchangeClientError,
  type GmailOAuthTokenExchangeClientInput,
  type GmailOAuthTokenExchangeClientResult,
} from "./gmail-oauth-token-exchange-types";

const googleScopeAliasMap = new Map<string, string>([
  ["https://www.googleapis.com/auth/gmail.readonly", "gmail.readonly"],
  ["https://www.googleapis.com/auth/gmail.send", "gmail.send"],
]);

const tokenResponseSchemaMessage =
  "Gmail OAuth token exchange returned an invalid provider response.";

function normalizeScopes(input: string[]): string[] {
  return [
    ...new Set(input.map((scope) => scope.trim()).filter(Boolean)),
  ].sort();
}

function parseScopeAliases(
  scopeValue: string,
  fallbackScopes: string[],
): string[] {
  const rawScopes = scopeValue
    .split(/\s+/)
    .map((scope) => scope.trim())
    .filter(Boolean);

  if (rawScopes.length === 0) {
    return normalizeScopes(fallbackScopes);
  }

  const aliases = rawScopes.map((scope) => googleScopeAliasMap.get(scope));

  if (aliases.some((scope) => scope === undefined)) {
    throw new GmailOAuthTokenExchangeClientError(
      "provider_invalid_response",
      tokenResponseSchemaMessage,
      "invalid_response",
    );
  }

  return normalizeScopes(aliases as string[]);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function parseJsonBody(
  response: Response,
): Promise<Record<string, unknown>> {
  try {
    const body = (await response.json()) as unknown;

    if (!isRecord(body)) {
      throw new Error("Response body is not an object.");
    }

    return body;
  } catch {
    throw new GmailOAuthTokenExchangeClientError(
      "provider_invalid_response",
      tokenResponseSchemaMessage,
      "invalid_response",
    );
  }
}

function extractProviderErrorCode(body: Record<string, unknown>): string {
  if (typeof body.error === "string" && body.error.trim().length > 0) {
    return body.error.trim().toLowerCase();
  }

  return "provider_http_error";
}

export type GoogleGmailOAuthTokenExchangeClientOptions = {
  fetchImplementation?: typeof fetch;
  nodeEnv?: "development" | "test" | "production";
  timeoutMs?: number;
};

export class GoogleGmailOAuthTokenExchangeClient implements GmailOAuthTokenExchangeClient {
  private readonly fetchImplementation: typeof fetch;
  private readonly timeoutMs: number;

  constructor(
    private readonly config: GmailProviderConfig,
    options?: GoogleGmailOAuthTokenExchangeClientOptions,
  ) {
    validateGmailProviderConfig(config, {
      nodeEnv: options?.nodeEnv ?? "development",
    });

    this.fetchImplementation = options?.fetchImplementation ?? globalThis.fetch;
    this.timeoutMs =
      options?.timeoutMs ?? config.oauthTokenExchangeTimeoutMs ?? 10_000;

    if (typeof this.fetchImplementation !== "function") {
      throw new Error(
        "Google Gmail OAuth token exchange client requires a fetch implementation.",
      );
    }
  }

  async exchangeAuthorizationCode(
    input: GmailOAuthTokenExchangeClientInput,
  ): Promise<GmailOAuthTokenExchangeClientResult> {
    const redirectUri = input.redirectUri.trim();

    if (!(this.config.oauthAllowedRedirectUris ?? []).includes(redirectUri)) {
      throw new GmailOAuthTokenExchangeClientError(
        "invalid_request",
        "Gmail OAuth redirect URI is not allowed.",
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.timeoutMs);

    try {
      const response = await this.fetchImplementation(
        this.config.oauthTokenEndpoint ?? "https://oauth2.googleapis.com/token",
        {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            accept: "application/json",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code: input.authorizationCode,
            client_id: this.config.oauthClientId ?? "",
            client_secret: this.config.oauthClientSecret ?? "",
            redirect_uri: redirectUri,
            code_verifier: input.codeVerifier,
          }),
          signal: controller.signal,
        },
      );

      const body = await parseJsonBody(response);

      if (!response.ok) {
        throw new GmailOAuthTokenExchangeClientError(
          extractProviderErrorCode(body),
          "Gmail OAuth token exchange failed.",
        );
      }

      const accessToken =
        typeof body.access_token === "string" ? body.access_token.trim() : "";
      const refreshToken =
        typeof body.refresh_token === "string" ? body.refresh_token.trim() : "";
      const expiresIn =
        typeof body.expires_in === "number" &&
        Number.isFinite(body.expires_in) &&
        body.expires_in > 0
          ? body.expires_in
          : null;
      const scopes =
        typeof body.scope === "string"
          ? parseScopeAliases(body.scope, input.scopes)
          : normalizeScopes(input.scopes);

      if (accessToken.length === 0 || refreshToken.length === 0) {
        throw new GmailOAuthTokenExchangeClientError(
          "provider_invalid_response",
          tokenResponseSchemaMessage,
          "invalid_response",
        );
      }

      return {
        scopes,
        tokenGrant: {
          accessToken,
          refreshToken,
          expiresAt:
            expiresIn === null ? null : new Date(Date.now() + expiresIn * 1000),
        },
      };
    } catch (error) {
      if (error instanceof GmailOAuthTokenExchangeClientError) {
        throw error;
      }

      if (
        error instanceof Error &&
        (error.name === "AbortError" || error.message.includes("aborted"))
      ) {
        throw new GmailOAuthTokenExchangeClientError(
          "provider_timeout",
          "Gmail OAuth token exchange timed out.",
          "timeout",
        );
      }

      throw new GmailOAuthTokenExchangeClientError(
        "provider_http_error",
        "Gmail OAuth token exchange failed.",
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
