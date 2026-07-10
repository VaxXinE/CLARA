import { z } from "zod";

export const gmailTokenVaultModes = ["mock", "encrypted"] as const;

export type GmailTokenVaultMode = (typeof gmailTokenVaultModes)[number];

export type GmailProviderConfig = {
  enabled: boolean;
  tokenVaultMode: GmailTokenVaultMode;
  oauthClientId?: string;
  oauthRedirectUri?: string;
  tokenEncryptionKey?: string;
};

const gmailProviderConfigSchema = z.object({
  GMAIL_PROVIDER_ENABLED: z.enum(["true", "false"]).optional(),
  GMAIL_TOKEN_VAULT_MODE: z.enum(gmailTokenVaultModes).optional(),
  GMAIL_OAUTH_CLIENT_ID: z.string().trim().optional(),
  GMAIL_OAUTH_REDIRECT_URI: z.string().trim().optional(),
  GMAIL_TOKEN_ENCRYPTION_KEY: z.string().trim().optional(),
});

export function loadGmailProviderConfig(
  input: NodeJS.ProcessEnv = process.env,
): GmailProviderConfig {
  const parsed = gmailProviderConfigSchema.parse(input);

  const config: GmailProviderConfig = {
    enabled: parsed.GMAIL_PROVIDER_ENABLED === "true",
    tokenVaultMode: parsed.GMAIL_TOKEN_VAULT_MODE ?? "mock",
  };

  if (parsed.GMAIL_OAUTH_CLIENT_ID) {
    config.oauthClientId = parsed.GMAIL_OAUTH_CLIENT_ID;
  }

  if (parsed.GMAIL_OAUTH_REDIRECT_URI) {
    config.oauthRedirectUri = parsed.GMAIL_OAUTH_REDIRECT_URI;
  }

  if (parsed.GMAIL_TOKEN_ENCRYPTION_KEY) {
    config.tokenEncryptionKey = parsed.GMAIL_TOKEN_ENCRYPTION_KEY;
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
    (!config.tokenEncryptionKey ||
      config.tokenEncryptionKey.trim().length === 0)
  ) {
    throw new Error(
      "Invalid Gmail provider configuration: GMAIL_TOKEN_ENCRYPTION_KEY is required when encrypted Gmail token storage is configured.",
    );
  }
}
