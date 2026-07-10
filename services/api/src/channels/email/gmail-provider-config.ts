import { z } from "zod";

export const gmailTokenVaultModes = ["mock", "encrypted"] as const;

export type GmailTokenVaultMode = (typeof gmailTokenVaultModes)[number];

export type GmailProviderConfig = {
  enabled: boolean;
  tokenVaultMode: GmailTokenVaultMode;
  oauthClientId?: string;
  oauthRedirectUri?: string;
  tokenEncryptionKeyBase64?: string;
  tokenEncryptionKeyVersion?: string;
};

const gmailProviderConfigSchema = z.object({
  GMAIL_PROVIDER_ENABLED: z.enum(["true", "false"]).optional(),
  GMAIL_TOKEN_VAULT_MODE: z.enum(gmailTokenVaultModes).optional(),
  GMAIL_OAUTH_CLIENT_ID: z.string().trim().optional(),
  GMAIL_OAUTH_REDIRECT_URI: z.string().trim().optional(),
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
    tokenEncryptionKeyVersion:
      parsed.TOKEN_VAULT_ENCRYPTION_KEY_VERSION ?? "v1",
  };

  if (parsed.GMAIL_OAUTH_CLIENT_ID) {
    config.oauthClientId = parsed.GMAIL_OAUTH_CLIENT_ID;
  }

  if (parsed.GMAIL_OAUTH_REDIRECT_URI) {
    config.oauthRedirectUri = parsed.GMAIL_OAUTH_REDIRECT_URI;
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
}
