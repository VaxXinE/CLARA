import { z } from "zod";

export const gmailTokenVaultModes = ["mock", "encrypted"] as const;
export const gmailOAuthTokenExchangeModes = [
  "disabled",
  "simulated",
  "real",
] as const;

export type GmailTokenVaultMode = (typeof gmailTokenVaultModes)[number];
export type GmailOAuthTokenExchangeMode =
  (typeof gmailOAuthTokenExchangeModes)[number];

export type GmailProviderConfig = {
  enabled: boolean;
  tokenVaultMode: GmailTokenVaultMode;
  oauthAuthorizationEndpoint: string;
  oauthTokenExchangeMode?: GmailOAuthTokenExchangeMode;
  oauthTokenEndpoint?: string;
  oauthClientId?: string;
  oauthClientSecret?: string;
  oauthRedirectUri?: string;
  oauthAllowedRedirectUris?: string[];
  oauthAllowedScopes: string[];
  oauthTokenExchangeTimeoutMs?: number;
  tokenEncryptionKeyBase64?: string;
  tokenEncryptionKeyVersion?: string;
};

const gmailProviderConfigSchema = z.object({
  GMAIL_PROVIDER_ENABLED: z.enum(["true", "false"]).optional(),
  GMAIL_TOKEN_VAULT_MODE: z.enum(gmailTokenVaultModes).optional(),
  GMAIL_OAUTH_AUTHORIZATION_ENDPOINT: z.string().trim().optional(),
  GMAIL_OAUTH_TOKEN_EXCHANGE_MODE: z
    .enum(gmailOAuthTokenExchangeModes)
    .optional(),
  GMAIL_OAUTH_TOKEN_ENDPOINT: z.string().trim().optional(),
  GMAIL_OAUTH_CLIENT_ID: z.string().trim().optional(),
  GMAIL_OAUTH_CLIENT_SECRET: z.string().trim().optional(),
  GMAIL_OAUTH_REDIRECT_URI: z.string().trim().optional(),
  GMAIL_OAUTH_REDIRECT_URI_ALLOWLIST: z.string().trim().optional(),
  GMAIL_OAUTH_ALLOWED_REDIRECT_URIS: z.string().trim().optional(),
  GMAIL_OAUTH_ALLOWED_SCOPES: z.string().trim().optional(),
  GMAIL_OAUTH_TOKEN_EXCHANGE_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(1)
    .optional(),
  TOKEN_VAULT_ENCRYPTION_KEY_BASE64: z.string().trim().optional(),
  TOKEN_VAULT_ENCRYPTION_KEY_VERSION: z.string().trim().optional(),
  GMAIL_TOKEN_ENCRYPTION_KEY: z.string().trim().optional(),
});

export function loadGmailProviderConfig(
  input: NodeJS.ProcessEnv = process.env,
): GmailProviderConfig {
  const parsed = gmailProviderConfigSchema.parse(input);

  const config: GmailProviderConfig = {
    enabled: parsed.GMAIL_PROVIDER_ENABLED === "true",
    tokenVaultMode: parsed.GMAIL_TOKEN_VAULT_MODE ?? "mock",
    oauthAuthorizationEndpoint:
      parsed.GMAIL_OAUTH_AUTHORIZATION_ENDPOINT ??
      "https://accounts.google.com/o/oauth2/v2/auth",
    oauthTokenExchangeMode:
      parsed.GMAIL_OAUTH_TOKEN_EXCHANGE_MODE ?? "disabled",
    oauthTokenEndpoint:
      parsed.GMAIL_OAUTH_TOKEN_ENDPOINT ??
      "https://oauth2.googleapis.com/token",
    oauthAllowedRedirectUris: [],
    oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
    oauthTokenExchangeTimeoutMs:
      parsed.GMAIL_OAUTH_TOKEN_EXCHANGE_TIMEOUT_MS ?? 10_000,
    tokenEncryptionKeyVersion:
      parsed.TOKEN_VAULT_ENCRYPTION_KEY_VERSION ?? "v1",
  };

  if (parsed.GMAIL_OAUTH_CLIENT_ID) {
    config.oauthClientId = parsed.GMAIL_OAUTH_CLIENT_ID;
  }

  if (parsed.GMAIL_OAUTH_CLIENT_SECRET) {
    config.oauthClientSecret = parsed.GMAIL_OAUTH_CLIENT_SECRET;
  }

  if (parsed.GMAIL_OAUTH_REDIRECT_URI) {
    config.oauthRedirectUri = parsed.GMAIL_OAUTH_REDIRECT_URI;
  }

  const redirectUriListSource =
    parsed.GMAIL_OAUTH_REDIRECT_URI_ALLOWLIST ??
    parsed.GMAIL_OAUTH_ALLOWED_REDIRECT_URIS ??
    parsed.GMAIL_OAUTH_REDIRECT_URI;

  if (redirectUriListSource) {
    config.oauthAllowedRedirectUris = redirectUriListSource
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
  }

  if (parsed.GMAIL_OAUTH_ALLOWED_SCOPES) {
    config.oauthAllowedScopes = parsed.GMAIL_OAUTH_ALLOWED_SCOPES.split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0);
  }

  if (parsed.TOKEN_VAULT_ENCRYPTION_KEY_BASE64) {
    config.tokenEncryptionKeyBase64 = parsed.TOKEN_VAULT_ENCRYPTION_KEY_BASE64;
  } else if (parsed.GMAIL_TOKEN_ENCRYPTION_KEY) {
    config.tokenEncryptionKeyBase64 = parsed.GMAIL_TOKEN_ENCRYPTION_KEY;
  }

  return config;
}

export function validateGmailProviderConfig(
  config: GmailProviderConfig,
  input: { nodeEnv: "development" | "test" | "production" },
): void {
  const oauthTokenExchangeMode = config.oauthTokenExchangeMode ?? "disabled";
  const oauthTokenEndpoint =
    config.oauthTokenEndpoint ?? "https://oauth2.googleapis.com/token";

  if (input.nodeEnv === "production" && config.tokenVaultMode === "mock") {
    throw new Error(
      "Invalid Gmail provider configuration: mock Gmail token vault is not allowed in production.",
    );
  }

  if (
    config.tokenVaultMode === "encrypted" &&
    (!config.tokenEncryptionKeyBase64 ||
      config.tokenEncryptionKeyBase64.trim().length === 0)
  ) {
    throw new Error(
      "Invalid Gmail provider configuration: TOKEN_VAULT_ENCRYPTION_KEY_BASE64 is required when encrypted Gmail token storage is configured.",
    );
  }

  if ((config.tokenEncryptionKeyVersion ?? "v1").trim().length === 0) {
    throw new Error(
      "Invalid Gmail provider configuration: TOKEN_VAULT_ENCRYPTION_KEY_VERSION must not be empty.",
    );
  }

  if ((config.oauthTokenExchangeTimeoutMs ?? 10_000) < 1) {
    throw new Error(
      "Invalid Gmail provider configuration: GMAIL_OAUTH_TOKEN_EXCHANGE_TIMEOUT_MS must be greater than 0.",
    );
  }

  if (config.oauthAuthorizationEndpoint.trim().length === 0) {
    throw new Error(
      "Invalid Gmail provider configuration: GMAIL_OAUTH_AUTHORIZATION_ENDPOINT must not be empty.",
    );
  }

  if (oauthTokenEndpoint.trim().length === 0) {
    throw new Error(
      "Invalid Gmail provider configuration: GMAIL_OAUTH_TOKEN_ENDPOINT must not be empty.",
    );
  }

  if (
    input.nodeEnv === "production" &&
    oauthTokenExchangeMode === "simulated"
  ) {
    throw new Error(
      "Invalid Gmail provider configuration: simulated Gmail OAuth token exchange is not allowed in production.",
    );
  }

  if (
    config.oauthRedirectUri &&
    !(config.oauthAllowedRedirectUris ?? []).includes(config.oauthRedirectUri)
  ) {
    throw new Error(
      "Invalid Gmail provider configuration: GMAIL_OAUTH_REDIRECT_URI must be present in the allowed redirect URI list.",
    );
  }

  if (
    config.enabled &&
    (!config.oauthClientId || config.oauthClientId.trim().length === 0)
  ) {
    throw new Error(
      "Invalid Gmail provider configuration: GMAIL_OAUTH_CLIENT_ID is required when Gmail provider integration is enabled.",
    );
  }

  if (config.enabled && (config.oauthAllowedRedirectUris ?? []).length === 0) {
    throw new Error(
      "Invalid Gmail provider configuration: GMAIL_OAUTH_REDIRECT_URI_ALLOWLIST is required when Gmail provider integration is enabled.",
    );
  }

  if (config.oauthAllowedScopes.length === 0) {
    throw new Error(
      "Invalid Gmail provider configuration: GMAIL_OAUTH_ALLOWED_SCOPES must contain at least one scope.",
    );
  }

  if (oauthTokenExchangeMode === "real") {
    if (!config.oauthClientId || config.oauthClientId.trim().length === 0) {
      throw new Error(
        "Invalid Gmail provider configuration: GMAIL_OAUTH_CLIENT_ID is required when real Gmail OAuth token exchange is configured.",
      );
    }

    if (
      !config.oauthClientSecret ||
      config.oauthClientSecret.trim().length === 0
    ) {
      throw new Error(
        "Invalid Gmail provider configuration: GMAIL_OAUTH_CLIENT_SECRET is required when real Gmail OAuth token exchange is configured.",
      );
    }

    if (oauthTokenEndpoint.trim().length === 0) {
      throw new Error(
        "Invalid Gmail provider configuration: GMAIL_OAUTH_TOKEN_ENDPOINT is required when real Gmail OAuth token exchange is configured.",
      );
    }
  }
}
