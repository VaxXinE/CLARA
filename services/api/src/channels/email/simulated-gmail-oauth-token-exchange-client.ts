import type { GmailProviderConfig } from "./gmail-provider-config";
import { validateGmailProviderConfig } from "./gmail-provider-config";
import type { GmailOAuthTokenExchangeClient } from "./gmail-oauth-token-exchange-client";
import type {
  GmailOAuthTokenExchangeClientInput,
  GmailOAuthTokenExchangeClientResult,
} from "./gmail-oauth-token-exchange-types";

export class SimulatedGmailOAuthTokenExchangeClient implements GmailOAuthTokenExchangeClient {
  constructor(
    private readonly options?: {
      config?: GmailProviderConfig;
      nodeEnv?: "development" | "test" | "production";
      responseFactory?: (
        input: GmailOAuthTokenExchangeClientInput,
      ) => GmailOAuthTokenExchangeClientResult;
    },
  ) {
    if (options?.config) {
      validateGmailProviderConfig(options.config, {
        nodeEnv: options.nodeEnv ?? "development",
      });
    }

    if ((options?.nodeEnv ?? "development") === "production") {
      throw new Error(
        "Simulated Gmail OAuth token exchange client is not allowed in production.",
      );
    }
  }

  async exchangeAuthorizationCode(
    input: GmailOAuthTokenExchangeClientInput,
  ): Promise<GmailOAuthTokenExchangeClientResult> {
    const response = this.options?.responseFactory?.(input);

    if (response) {
      return response;
    }

    return {
      emailAddress: "simulated.gmail.account@example.test",
      displayName: "Simulated Gmail Account",
      scopes: [...new Set(input.scopes)].sort(),
      metadata: {
        mailboxType: "google_workspace",
        connectionOrigin: "test",
      },
      tokenGrant: {
        accessToken: "example-gmail-access-token",
        refreshToken: "example-gmail-refresh-token",
        expiresAt: new Date("2026-07-10T14:00:00.000Z"),
      },
    };
  }
}
