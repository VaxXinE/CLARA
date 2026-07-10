import { afterEach, describe, expect, it, vi } from "vitest";
import { createGmailApiClient } from "../src/channels/email/gmail-api-client";
import { GmailApiClientError } from "../src/channels/email/gmail-api-client-types";
import { GoogleGmailApiClient } from "../src/channels/email/google-gmail-api-client";

function createConfig(overrides?: {
  apiMode?: "disabled" | "mocked" | "real";
  apiBaseUrl?: string;
  apiTimeoutMs?: number;
}) {
  return {
    enabled: true,
    tokenVaultMode: "encrypted" as const,
    oauthAuthorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    oauthClientId: "gmail-client-id-placeholder",
    oauthAllowedRedirectUris: [
      "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
    ],
    oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
    tokenEncryptionKeyBase64: Buffer.alloc(32, 6).toString("base64"),
    tokenEncryptionKeyVersion: "v1",
    apiMode: overrides?.apiMode ?? "real",
    apiBaseUrl: overrides?.apiBaseUrl ?? "https://gmail.googleapis.com/",
    apiTimeoutMs: overrides?.apiTimeoutMs ?? 10_000,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GoogleGmailApiClient", () => {
  it("builds an authorized Gmail API request with a bearer token", async () => {
    const fetchSpy = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          messagesTotal: 10,
          threadsTotal: 4,
          historyId: "12345",
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );

    const client = new GoogleGmailApiClient(createConfig(), {
      fetchImplementation: fetchSpy,
      nodeEnv: "test",
    });

    const result = await client.requestJson<{
      messagesTotal: number;
      threadsTotal: number;
      historyId: string;
    }>({
      accessToken: "gmail-access-token-placeholder",
      method: "GET",
      path: "/gmail/v1/users/me/profile",
      query: {
        alt: "json",
      },
    });

    expect(result).toEqual({
      messagesTotal: 10,
      threadsTotal: 4,
      historyId: "12345",
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, requestInit] = fetchSpy.mock.calls[0] ?? [];
    expect(url).toBe(
      "https://gmail.googleapis.com/gmail/v1/users/me/profile?alt=json",
    );
    expect(requestInit?.headers).toMatchObject({
      accept: "application/json",
      authorization: "Bearer gmail-access-token-placeholder",
    });
  });

  it("sanitizes timeout and provider failures without exposing the access token", async () => {
    const accessToken = "gmail-access-token-placeholder";
    const timeoutClient = new GoogleGmailApiClient(createConfig(), {
      fetchImplementation: vi.fn<typeof fetch>().mockRejectedValue(
        Object.assign(new Error("request aborted"), {
          name: "AbortError",
        }),
      ),
      nodeEnv: "test",
      timeoutMs: 5,
    });

    await expect(
      timeoutClient.requestJson({
        accessToken,
        method: "GET",
        path: "/gmail/v1/users/me/profile",
      }),
    ).rejects.toMatchObject({
      code: "gmail_api_timeout",
      category: "timeout",
    } satisfies Partial<GmailApiClientError>);

    await expect(
      timeoutClient.requestJson({
        accessToken,
        method: "GET",
        path: "/gmail/v1/users/me/profile",
      }),
    ).rejects.not.toThrow(accessToken);

    const providerErrorClient = new GoogleGmailApiClient(createConfig(), {
      fetchImplementation: vi.fn<typeof fetch>().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: {
              code: 401,
              status: "UNAUTHENTICATED",
              message: `provider saw bearer ${accessToken}`,
            },
          }),
          {
            status: 401,
            headers: {
              "content-type": "application/json",
            },
          },
        ),
      ),
      nodeEnv: "test",
    });

    try {
      await providerErrorClient.requestJson({
        accessToken,
        method: "GET",
        path: "/gmail/v1/users/me/profile",
      });
    } catch (error) {
      expect(error).toBeInstanceOf(GmailApiClientError);
      expect(JSON.stringify(error)).not.toContain(accessToken);
      expect((error as GmailApiClientError).code).toBe(
        "gmail_api_unauthenticated",
      );
    }
  });

  it("rejects invalid JSON, invalid payloads, and missing token safely", async () => {
    const invalidJsonClient = new GoogleGmailApiClient(createConfig(), {
      fetchImplementation: vi.fn<typeof fetch>().mockResolvedValue(
        new Response("not-json", {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        }),
      ),
      nodeEnv: "test",
    });

    await expect(
      invalidJsonClient.requestJson({
        accessToken: "gmail-access-token-placeholder",
        method: "GET",
        path: "/gmail/v1/users/me/profile",
      }),
    ).rejects.toMatchObject({
      code: "gmail_api_invalid_response",
      category: "invalid_response",
    } satisfies Partial<GmailApiClientError>);

    const invalidPayloadClient = new GoogleGmailApiClient(createConfig(), {
      fetchImplementation: vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify("not-an-object"), {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        }),
      ),
      nodeEnv: "test",
    });

    await expect(
      invalidPayloadClient.requestJson({
        accessToken: "gmail-access-token-placeholder",
        method: "GET",
        path: "/gmail/v1/users/me/profile",
      }),
    ).rejects.toMatchObject({
      code: "gmail_api_invalid_response",
      category: "invalid_response",
    } satisfies Partial<GmailApiClientError>);

    const missingTokenClient = new GoogleGmailApiClient(createConfig(), {
      fetchImplementation: vi.fn<typeof fetch>(),
      nodeEnv: "test",
    });

    await expect(
      missingTokenClient.requestJson({
        accessToken: "   ",
        method: "GET",
        path: "/gmail/v1/users/me/profile",
      }),
    ).rejects.toMatchObject({
      code: "gmail_api_missing_token",
      category: "missing_token",
    } satisfies Partial<GmailApiClientError>);
  });

  it("requires explicit real config and does not call real network in tests", async () => {
    expect(
      createGmailApiClient(
        createConfig({
          apiMode: "disabled",
        }),
        {
          nodeEnv: "test",
        },
      ),
    ).toBeNull();

    expect(
      () =>
        new GoogleGmailApiClient(
          {
            enabled: true,
            tokenVaultMode: "encrypted",
            oauthAuthorizationEndpoint:
              "https://accounts.google.com/o/oauth2/v2/auth",
            oauthClientId: "gmail-client-id-placeholder",
            oauthAllowedRedirectUris: [
              "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
            ],
            oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
            tokenEncryptionKeyBase64: Buffer.alloc(32, 6).toString("base64"),
            tokenEncryptionKeyVersion: "v1",
            apiMode: "real",
          },
          {
            fetchImplementation: vi.fn<typeof fetch>(),
            nodeEnv: "production",
          },
        ),
    ).toThrow(
      "GMAIL_API_BASE_URL is required when real Gmail API mode is configured",
    );

    const fetchSpy = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          historyId: "12345",
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );

    const client = createGmailApiClient(createConfig(), {
      fetchImplementation: fetchSpy,
      nodeEnv: "test",
    });

    expect(client).toBeInstanceOf(GoogleGmailApiClient);

    await client?.requestJson({
      accessToken: "gmail-access-token-placeholder",
      method: "GET",
      path: "/gmail/v1/users/me/profile",
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
