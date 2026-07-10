import { afterEach, describe, expect, it, vi } from "vitest";
import {
  GoogleGmailOAuthTokenRefreshClient,
  type GoogleGmailOAuthTokenRefreshClientOptions,
} from "../src/channels/email/google-gmail-oauth-token-refresh-client";
import { GmailOAuthTokenRefreshClientError } from "../src/channels/email/gmail-oauth-token-refresh-types";

function createConfig(overrides?: {
  oauthClientSecret?: string;
  oauthTokenEndpoint?: string;
  oauthTokenRefreshTimeoutMs?: number;
}) {
  return {
    enabled: true,
    tokenVaultMode: "encrypted" as const,
    oauthAuthorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    oauthTokenRefreshMode: "real" as const,
    oauthTokenEndpoint:
      overrides?.oauthTokenEndpoint ?? "https://oauth2.googleapis.com/token",
    oauthClientId: "gmail-client-id-placeholder",
    oauthClientSecret:
      overrides?.oauthClientSecret ?? "gmail-client-secret-placeholder",
    oauthAllowedRedirectUris: [
      "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
    ],
    oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
    oauthTokenRefreshTimeoutMs: overrides?.oauthTokenRefreshTimeoutMs ?? 10_000,
    tokenEncryptionKeyBase64: Buffer.alloc(32, 5).toString("base64"),
    tokenEncryptionKeyVersion: "v1",
  };
}

function createClient(
  fetchImplementation: typeof fetch,
  options?: Omit<
    GoogleGmailOAuthTokenRefreshClientOptions,
    "fetchImplementation"
  >,
) {
  return new GoogleGmailOAuthTokenRefreshClient(createConfig(), {
    fetchImplementation,
    nodeEnv: "test",
    ...options,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GoogleGmailOAuthTokenRefreshClient", () => {
  it("sends the expected form body for real refresh token exchange using mocked fetch", async () => {
    const fetchSpy = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          access_token: "atk2",
          refresh_token: "rtk2",
          expires_in: 3600,
          scope:
            "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly",
        }),
        {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );

    const client = createClient(fetchSpy);
    const result = await client.refreshAccessToken({
      refreshToken: "rtk0",
      scopes: ["gmail.readonly", "gmail.send"],
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, requestInit] = fetchSpy.mock.calls[0] ?? [];
    expect(url).toBe("https://oauth2.googleapis.com/token");
    expect(requestInit?.method).toBe("POST");

    const params = requestInit?.body as URLSearchParams;
    expect(params.get("grant_type")).toBe("refresh_token");
    expect(params.get("refresh_token")).toBe("rtk0");
    expect(params.get("client_id")).toBe("gmail-client-id-placeholder");
    expect(params.get("client_secret")).toBe("gmail-client-secret-placeholder");
    expect(result.scopes).toEqual(["gmail.readonly", "gmail.send"]);
    expect(result.tokenGrant.accessToken).toBe("atk2");
    expect(result.tokenGrant.refreshToken).toBe("rtk2");
    expect(JSON.stringify(result)).not.toContain("rtk0");
    expect(JSON.stringify(result)).not.toContain(
      "gmail-client-secret-placeholder",
    );
  });

  it("sanitizes timeout failures", async () => {
    const fetchSpy = vi.fn<typeof fetch>().mockRejectedValue(
      Object.assign(new Error("request aborted"), {
        name: "AbortError",
      }),
    );

    const client = createClient(fetchSpy, {
      timeoutMs: 5,
    });

    await expect(
      client.refreshAccessToken({
        refreshToken: "rtk0",
        scopes: ["gmail.readonly"],
      }),
    ).rejects.toMatchObject({
      code: "provider_timeout",
      category: "timeout",
    } satisfies Partial<GmailOAuthTokenRefreshClientError>);
  });

  it("sanitizes non-2xx provider responses and invalid payloads", async () => {
    const providerErrorClient = createClient(
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: "invalid_grant",
            error_description: "do not leak",
          }),
          {
            status: 400,
            headers: {
              "content-type": "application/json",
            },
          },
        ),
      ),
    );

    await expect(
      providerErrorClient.refreshAccessToken({
        refreshToken: "rtk0",
        scopes: ["gmail.readonly"],
      }),
    ).rejects.toMatchObject({
      code: "invalid_grant",
      category: "provider",
    } satisfies Partial<GmailOAuthTokenRefreshClientError>);

    const invalidPayloadClient = createClient(
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(
          JSON.stringify({
            expires_in: 3600,
          }),
          {
            status: 200,
            headers: {
              "content-type": "application/json",
            },
          },
        ),
      ),
    );

    await expect(
      invalidPayloadClient.refreshAccessToken({
        refreshToken: "rtk0",
        scopes: ["gmail.readonly"],
      }),
    ).rejects.toMatchObject({
      code: "provider_invalid_response",
      category: "invalid_response",
    } satisfies Partial<GmailOAuthTokenRefreshClientError>);
  });
});
