import { z } from "zod";

export const gmailTokenVaultModes = ["mock", "encrypted"] as const;

export type GmailTokenVaultMode = (typeof gmailTokenVaultModes)[number];

export type GmailProviderConfig = {
  enabled: boolean;
  tokenVaultMode: GmailTokenVaultMode;
  oauthAuthorizationEndpoint: string;
  oauthClientId?: string;
  oauthRedirectUri?: string;
  oauthAllowedRedirectUris?: string[];
  oauthAllowedScopes: string[];
  tokenEncryptionKeyBase64?: string;
  tokenEncryptionKeyVersion?: string;
};

const gmailProviderConfigSchema = z.object({
  GMAIL_PROVIDER_ENABLED: z.enum(["true", "false"]).optional(),
  GMAIL_TOKEN_VAULT_MODE: z.enum(gmailTokenVaultModes).optional(),
  GMAIL_OAUTH_AUTHORIZATION_ENDPOINT: z.string().trim().optional(),
  GMAIL_OAUTH_CLIENT_ID: z.string().trim().optional(),
  GMAIL_OAUTH_REDIRECT_URI: z.string().trim().optional(),
  GMAIL_OAUTH_REDIRECT_URI_ALLOWLIST: z.string().trim().optional(),
  GMAIL_OAUTH_ALLOWED_REDIRECT_URIS: z.string().trim().optional(),
  GMAIL_OAUTH_ALLOWED_SCOPES: z.string().trim().optional(),
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
    oauthAllowedRedirectUris: [],
    oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
    tokenEncryptionKeyVersion:
      parsed.TOKEN_VAULT_ENCRYPTION_KEY_VERSION ?? "v1",
  };

  if (parsed.GMAIL_OAUTH_CLIENT_ID) {
    config.oauthClientId = parsed.GMAIL_OAUTH_CLIENT_ID;
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

  if (config.oauthAuthorizationEndpoint.trim().length === 0) {
    throw new Error(
      "Invalid Gmail provider configuration: GMAIL_OAUTH_AUTHORIZATION_ENDPOINT must not be empty.",
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
}
