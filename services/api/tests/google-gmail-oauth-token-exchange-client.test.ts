import { afterEach, describe, expect, it, vi } from "vitest";
import {
  GoogleGmailOAuthTokenExchangeClient,
  type GoogleGmailOAuthTokenExchangeClientOptions,
} from "../src/channels/email/google-gmail-oauth-token-exchange-client";
import { GmailOAuthTokenExchangeClientError } from "../src/channels/email/gmail-oauth-token-exchange-types";

function createConfig(overrides?: {
  oauthClientSecret?: string;
  oauthTokenEndpoint?: string;
  oauthTokenExchangeTimeoutMs?: number;
}) {
  return {
    enabled: true,
    tokenVaultMode: "encrypted" as const,
    oauthAuthorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    oauthTokenExchangeMode: "real" as const,
    oauthTokenEndpoint:
      overrides?.oauthTokenEndpoint ?? "https://oauth2.googleapis.com/token",
    oauthClientId: "gmail-client-id-placeholder",
    oauthClientSecret:
      overrides?.oauthClientSecret ?? "gmail-client-secret-placeholder",
    oauthRedirectUri:
      "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
    oauthAllowedRedirectUris: [
      "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
    ],
    oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
    oauthTokenExchangeTimeoutMs:
      overrides?.oauthTokenExchangeTimeoutMs ?? 10_000,
    tokenEncryptionKeyBase64: Buffer.alloc(32, 5).toString("base64"),
    tokenEncryptionKeyVersion: "v1",
  };
}

function createClient(
  fetchImplementation: typeof fetch,
  options?: Omit<
    GoogleGmailOAuthTokenExchangeClientOptions,
    "fetchImplementation"
  >,
) {
  return new GoogleGmailOAuthTokenExchangeClient(createConfig(), {
    fetchImplementation,
    nodeEnv: "test",
    ...options,
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("GoogleGmailOAuthTokenExchangeClient", () => {
  it("sends the expected form body for real token exchange using mocked fetch", async () => {
    const fetchSpy = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          access_token: "mock-access-token",
          refresh_token: "mock-refresh-token",
          expires_in: 3600,
          scope:
            "https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly",
          token_type: "Bearer",
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
    const result = await client.exchangeAuthorizationCode({
      authorizationCode: "authorization-code-placeholder",
      codeVerifier: "pkce-code-verifier-placeholder",
      redirectUri:
        "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
      scopes: ["gmail.readonly", "gmail.send"],
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [url, requestInit] = fetchSpy.mock.calls[0] ?? [];
    expect(url).toBe("https://oauth2.googleapis.com/token");
    expect(requestInit?.method).toBe("POST");
    expect(requestInit?.headers).toMatchObject({
      "content-type": "application/x-www-form-urlencoded",
      accept: "application/json",
    });

    const body = requestInit?.body;
    expect(body).toBeInstanceOf(URLSearchParams);

    const params = body as URLSearchParams;
    expect(params.get("grant_type")).toBe("authorization_code");
    expect(params.get("code")).toBe("authorization-code-placeholder");
    expect(params.get("client_id")).toBe("gmail-client-id-placeholder");
    expect(params.get("client_secret")).toBe("gmail-client-secret-placeholder");
    expect(params.get("redirect_uri")).toBe(
      "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
    );
    expect(params.get("code_verifier")).toBe("pkce-code-verifier-placeholder");

    expect(result.scopes).toEqual(["gmail.readonly", "gmail.send"]);
    expect(result.tokenGrant.accessToken).toBe("mock-access-token");
    expect(result.tokenGrant.refreshToken).toBe("mock-refresh-token");
    expect(JSON.stringify(result)).not.toContain(
      "gmail-client-secret-placeholder",
    );
    expect(JSON.stringify(result)).not.toContain(
      "authorization-code-placeholder",
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
      client.exchangeAuthorizationCode({
        authorizationCode: "authorization-code-placeholder",
        codeVerifier: "pkce-code-verifier-placeholder",
        redirectUri:
          "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
        scopes: ["gmail.readonly"],
      }),
    ).rejects.toMatchObject({
      code: "provider_timeout",
      category: "timeout",
    } satisfies Partial<GmailOAuthTokenExchangeClientError>);
  });

  it("sanitizes non-2xx provider responses", async () => {
    const fetchSpy = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: "invalid_client",
          error_description: "do not leak this provider detail",
        }),
        {
          status: 401,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );
    const client = createClient(fetchSpy);

    await expect(
      client.exchangeAuthorizationCode({
        authorizationCode: "authorization-code-placeholder",
        codeVerifier: "pkce-code-verifier-placeholder",
        redirectUri:
          "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
        scopes: ["gmail.readonly"],
      }),
    ).rejects.toMatchObject({
      code: "invalid_client",
      category: "provider",
    } satisfies Partial<GmailOAuthTokenExchangeClientError>);
  });

  it("rejects invalid JSON or incomplete provider payloads safely", async () => {
    const invalidJsonClient = createClient(
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response("not-json", {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        }),
      ),
    );

    await expect(
      invalidJsonClient.exchangeAuthorizationCode({
        authorizationCode: "authorization-code-placeholder",
        codeVerifier: "pkce-code-verifier-placeholder",
        redirectUri:
          "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
        scopes: ["gmail.readonly"],
      }),
    ).rejects.toMatchObject({
      code: "provider_invalid_response",
      category: "invalid_response",
    } satisfies Partial<GmailOAuthTokenExchangeClientError>);

    const incompletePayloadClient = createClient(
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(
          JSON.stringify({
            access_token: "mock-access-token",
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
      incompletePayloadClient.exchangeAuthorizationCode({
        authorizationCode: "authorization-code-placeholder",
        codeVerifier: "pkce-code-verifier-placeholder",
        redirectUri:
          "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
        scopes: ["gmail.readonly"],
      }),
    ).rejects.toMatchObject({
      code: "provider_invalid_response",
      category: "invalid_response",
    } satisfies Partial<GmailOAuthTokenExchangeClientError>);
  });
});
