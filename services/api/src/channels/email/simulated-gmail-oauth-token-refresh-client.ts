import type { GmailProviderConfig } from "./gmail-provider-config";
import { validateGmailProviderConfig } from "./gmail-provider-config";
import type { GmailOAuthTokenRefreshClient } from "./gmail-oauth-token-refresh-client";
import type {
  GmailOAuthTokenRefreshClientInput,
  GmailOAuthTokenRefreshClientResult,
} from "./gmail-oauth-token-refresh-types";

export class SimulatedGmailOAuthTokenRefreshClient implements GmailOAuthTokenRefreshClient {
  constructor(
    private readonly options?: {
      config?: GmailProviderConfig;
      nodeEnv?: "development" | "test" | "production";
      responseFactory?: (
        input: GmailOAuthTokenRefreshClientInput,
      ) => GmailOAuthTokenRefreshClientResult;
    },
  ) {
    if (options?.config) {
      validateGmailProviderConfig(options.config, {
        nodeEnv: options.nodeEnv ?? "development",
      });
    }

    if ((options?.nodeEnv ?? "development") === "production") {
      throw new Error(
        "Simulated Gmail OAuth token refresh client is not allowed in production.",
      );
    }
  }

  async refreshAccessToken(
    input: GmailOAuthTokenRefreshClientInput,
  ): Promise<GmailOAuthTokenRefreshClientResult> {
    const response = this.options?.responseFactory?.(input);

    if (response) {
      return response;
    }

    return {
      scopes: [...new Set(input.scopes)].sort(),
      tokenGrant: {
        accessToken: "atk",
        refreshToken: null,
        expiresAt: new Date("2026-07-10T15:00:00.000Z"),
      },
    };
  }
}
