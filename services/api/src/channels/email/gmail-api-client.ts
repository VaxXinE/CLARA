import type { GmailProviderConfig } from "./gmail-provider-config";
import { validateGmailProviderConfig } from "./gmail-provider-config";
import {
  GoogleGmailApiClient,
  type GoogleGmailApiClientOptions,
} from "./google-gmail-api-client";
import type { GmailApiRequestInput } from "./gmail-api-client-types";

export interface GmailApiClient {
  requestJson<T>(input: GmailApiRequestInput): Promise<T>;
}

class MockedGmailApiClient implements GmailApiClient {
  constructor(
    private readonly handler?: <T>(input: GmailApiRequestInput) => Promise<T>,
  ) {}

  async requestJson<T>(input: GmailApiRequestInput): Promise<T> {
    if (!this.handler) {
      throw new Error("Mocked Gmail API client handler is not configured.");
    }

    return this.handler<T>(input);
  }
}

export function createGmailApiClient(
  config: GmailProviderConfig,
  options?: GoogleGmailApiClientOptions & {
    mockedHandler?: <T>(input: GmailApiRequestInput) => Promise<T>;
  },
): GmailApiClient | null {
  validateGmailProviderConfig(config, {
    nodeEnv: options?.nodeEnv ?? "development",
  });

  switch (config.apiMode ?? "disabled") {
    case "disabled":
      return null;

    case "mocked":
      if ((options?.nodeEnv ?? "development") === "production") {
        throw new Error(
          "Mocked Gmail API client is not allowed in production.",
        );
      }

      return new MockedGmailApiClient(options?.mockedHandler);

    case "real":
      return new GoogleGmailApiClient(config, options);
  }
}
