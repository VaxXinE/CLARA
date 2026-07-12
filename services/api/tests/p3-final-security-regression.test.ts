import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { AuditLogService } from "../src/audit/audit-log-service";
import { FixtureAuditLogRepository } from "../src/audit/audit-log-repository";
import { EmailOutboundDeliveryService } from "../src/channels/email/email-outbound-delivery-service";
import { FixtureEmailOutboundDeliveryRepository } from "../src/channels/email/email-outbound-delivery-repository";
import { GmailOAuthCallbackService } from "../src/channels/email/gmail-oauth-callback-service";
import { GmailOAuthConnectService } from "../src/channels/email/gmail-oauth-connect-service";
import { FixtureGmailOAuthStateRepository } from "../src/channels/email/gmail-oauth-state-repository";
import { GmailOAuthStateService } from "../src/channels/email/gmail-oauth-state-service";
import type { GmailOutboundSendClient } from "../src/channels/email/gmail-outbound-send-client-types";
import { GmailOutboundSendService } from "../src/channels/email/gmail-outbound-send-service";
import { SimulatedGmailOutboundSendClient } from "../src/channels/email/simulated-gmail-outbound-send-client";
import { loadEnv } from "../src/config/env";
import { createFixtureAppStore } from "../src/db/fixtures/fixture-store";
import { redactValue } from "../src/logging/redaction";
import { createServer } from "../src/http/server";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

const forbiddenFragments = [
  "atk",
  "rtk",
  "Authorization",
  ["client", "secret"].join("_"),
  "raw Gmail payload",
  "raw provider error body",
  "email body",
] as const;

function authHeaders(role: "owner" | "agent" | "viewer", workspaceId?: string) {
  return {
    "x-mock-user-id": `usr_demo_${role}`,
    "x-mock-organization-id": "org_demo",
    "x-mock-workspace-id": workspaceId ?? "wks_demo_sales",
    "x-mock-role": role,
  };
}

function expectSafe(value: unknown): void {
  const serialized = JSON.stringify(value);

  for (const fragment of forbiddenFragments) {
    expect(serialized).not.toContain(fragment);
  }
}

function createOAuthServices() {
  const config = {
    enabled: true,
    tokenVaultMode: "encrypted" as const,
    oauthAuthorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    oauthClientId: "gmail-client-id-placeholder",
    oauthRedirectUri:
      "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
    oauthAllowedRedirectUris: [
      "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
    ],
    oauthAllowedScopes: ["gmail.readonly", "gmail.send"],
    tokenEncryptionKeyBase64: Buffer.alloc(32, 22).toString("base64"),
    tokenEncryptionKeyVersion: "v1",
  };
  const stateService = new GmailOAuthStateService(
    new FixtureGmailOAuthStateRepository(),
    config,
    {
      nodeEnv: "test",
    },
  );

  return {
    connect: new GmailOAuthConnectService(stateService, config, {
      nodeEnv: "test",
    }),
    callback: new GmailOAuthCallbackService(stateService),
  };
}

describe("P3 final security regression", () => {
  it("blocks unauthenticated and viewer access on Gmail mutation routes", async () => {
    const { connect } = createOAuthServices();
    const syncMessages = vi.fn();
    const tickNow = vi.fn();
    const outboundSendClient: GmailOutboundSendClient = {
      send: vi.fn(async () => ({
        status: "simulated" as const,
        providerMessageId: "gmail_msg_demo",
        sentAt: new Date("2026-07-12T00:00:00.000Z"),
      })),
    };
    const app = await createServer({
      env: testEnv,
      gmailOAuthConnectService: connect,
      gmailInboundSyncService: {
        syncMessages,
      },
      gmailInboundSyncSchedulerStatus: {
        getStatus: () => ({
          scheduler_enabled: true,
          scheduler_running: false,
          interval_ms: 300000,
          max_accounts_per_tick: 10,
          max_messages_per_account: 25,
        }),
        tickNow,
      },
      gmailOutboundSendService: new GmailOutboundSendService(
        outboundSendClient,
      ),
    });

    const unauthenticatedConnect = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/oauth/connect",
    });
    const viewerConnect = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/oauth/connect",
      headers: authHeaders("viewer"),
    });
    const viewerSync = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/accounts/gmail_account_demo/sync",
      headers: authHeaders("viewer"),
    });
    const viewerTick = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/scheduler/tick",
      headers: authHeaders("viewer"),
    });
    const viewerOutbound = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/outbound/send",
      headers: authHeaders("viewer"),
      payload: {
        provider_account_id: "gmail_account_demo",
        conversation_id: "conv_demo_budi_stock",
        to: ["customer@example.test"],
        body: "email body",
      },
    });
    const viewerReply = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/reply",
      headers: authHeaders("viewer"),
      payload: {
        body: "email body",
      },
    });

    await app.close();

    expect(unauthenticatedConnect.statusCode).toBe(401);
    expect(viewerConnect.statusCode).toBe(403);
    expect(viewerSync.statusCode).toBe(403);
    expect(viewerTick.statusCode).toBe(403);
    expect(viewerOutbound.statusCode).toBe(403);
    expect(viewerReply.statusCode).toBe(403);
    expect(syncMessages).not.toHaveBeenCalled();
    expect(tickNow).not.toHaveBeenCalled();
    expect(outboundSendClient.send).not.toHaveBeenCalled();
    expectSafe([
      unauthenticatedConnect.json(),
      viewerConnect.json(),
      viewerSync.json(),
      viewerTick.json(),
      viewerOutbound.json(),
      viewerReply.json(),
    ]);
  });

  it("keeps OAuth callback and token-facing responses free of transient secrets", async () => {
    const { connect, callback } = createOAuthServices();
    const app = await createServer({
      env: testEnv,
      gmailOAuthConnectService: connect,
      gmailOAuthCallbackService: callback,
    });

    const connectResponse = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/oauth/connect",
      headers: authHeaders("agent"),
      payload: {
        redirect_uri:
          "https://allowed.example.com/api/v1/integrations/gmail/oauth/callback",
        scopes: ["gmail.readonly"],
      },
    });
    const state = new URL(
      connectResponse.json().authorization_url as string,
    ).searchParams.get("state");
    const callbackResponse = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/gmail/oauth/callback?code=code_demo&state=${state}`,
    });
    const providerError = await app.inject({
      method: "GET",
      url: "/api/v1/integrations/gmail/oauth/callback?error=access_denied&error_description=raw%20provider%20error%20body",
    });

    await app.close();

    expect(callbackResponse.statusCode).toBe(200);
    expect(callbackResponse.json()).toMatchObject({
      provider: "gmail",
      status: "pending_token_exchange",
    });
    expect(providerError.statusCode).toBe(400);
    expect(providerError.json()).toMatchObject({
      provider: "gmail",
      status: "provider_error",
    });
    expectSafe([callbackResponse.json(), providerError.json()]);
    expect(JSON.stringify(callbackResponse.json())).not.toContain("code_demo");
    expect(JSON.stringify(callbackResponse.json())).not.toContain(state);
    expect(JSON.stringify(providerError.json())).not.toContain(
      "error_description",
    );
  });

  it("keeps outbound delivery status scoped and safe", async () => {
    const store = createFixtureAppStore();
    const deliveries = new EmailOutboundDeliveryService(
      new FixtureEmailOutboundDeliveryRepository(store),
    );
    const delivery = await deliveries.recordGmailOutboundFailure({
      scope: {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      conversationId: "conv_demo_budi_stock",
      actorUserId: "usr_demo_agent",
      failureCode: "provider_send_failed",
    });
    const app = await createServer({
      env: testEnv,
      gmailOutboundDeliveryService: deliveries,
    });

    const spoofedQuery = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/gmail/outbound/deliveries/${delivery.id}?organization_id=org_other&workspace_id=wks_other`,
      headers: authHeaders("viewer"),
    });
    const crossWorkspace = await app.inject({
      method: "GET",
      url: `/api/v1/integrations/gmail/outbound/deliveries/${delivery.id}`,
      headers: authHeaders("agent", "wks_other"),
    });

    await app.close();

    expect(spoofedQuery.statusCode).toBe(200);
    expect(spoofedQuery.json()).toMatchObject({
      data: {
        outbound_delivery_id: delivery.id,
        provider: "gmail",
        status: "failed",
        reason_code: "provider_send_failed",
      },
    });
    expect(crossWorkspace.statusCode).toBe(404);
    expectSafe([spoofedQuery.json(), crossWorkspace.json()]);
  });

  it("redacts provider and token fields from logs and audit metadata", async () => {
    const store = createFixtureAppStore();
    const auditLogs = new AuditLogService(new FixtureAuditLogRepository(store));
    const deliveries = new EmailOutboundDeliveryService(
      new FixtureEmailOutboundDeliveryRepository(store),
    );
    const app = await createServer({
      env: testEnv,
      gmailOutboundSendService: new GmailOutboundSendService(
        new SimulatedGmailOutboundSendClient(),
        deliveries,
        auditLogs,
      ),
    });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/integrations/gmail/outbound/send",
      headers: authHeaders("agent"),
      payload: {
        provider_account_id: "gmail_account_demo",
        conversation_id: "conv_demo_budi_stock",
        to: ["customer@example.test"],
        body: "email body",
      },
    });
    const redacted = redactValue({
      authorization: "Bearer atk",
      refresh_token: "rtk",
      provider_raw_error: "raw provider error body",
      raw_payload: "raw Gmail payload",
      safe: "ok",
    });

    await app.close();

    expect(response.statusCode).toBe(200);
    expect(redacted).toEqual({
      authorization: "[REDACTED]",
      refresh_token: "[REDACTED]",
      provider_raw_error: "[REDACTED]",
      raw_payload: "[REDACTED]",
      safe: "ok",
    });
    expect(store.auditLogs).toHaveLength(2);
    expect(store.auditLogs.at(-1)?.metadataJson).toMatchObject({
      provider: "gmail",
      status: "simulated",
      reason_code: "simulated_send_completed",
      conversation_id: "conv_demo_budi_stock",
      outbound_delivery_id: expect.stringMatching(/^email_outbound_/),
      recipient_count: 1,
    });
    expectSafe(store.auditLogs);
  });

  it("keeps dashboard Gmail visibility read-only and HTML-safe", () => {
    const dashboardFiles = [
      "src/App.tsx",
      "src/components/GmailSchedulerStatusPanel.tsx",
      "src/components/GmailOutboundStatusPanel.tsx",
      "src/components/OutboundDeliveryStatusBadge.tsx",
    ].map((file) =>
      readFileSync(
        path.resolve(__dirname, "../../../apps/dashboard", file),
        "utf8",
      ),
    );
    const source = dashboardFiles.join("\n");

    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toContain("/api/v1/integrations/gmail/outbound/send");
    expect(source).not.toContain("/api/v1/integrations/gmail/scheduler/tick");
    expect(source).not.toMatch(/resend/i);
    expect(source).not.toMatch(/retry/i);
    expect(source).not.toContain("access_token");
    expect(source).not.toContain("refresh_token");
    expect(source).not.toContain("raw Gmail payload");
  });
});
