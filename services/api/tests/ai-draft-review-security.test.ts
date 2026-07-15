import { describe, expect, it } from "vitest";
import { createServer } from "../src/http/server";
import { loadEnv } from "../src/config/env";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

const authHeaders = {
  "x-mock-user-id": "usr_demo_agent",
  "x-mock-organization-id": "org_demo",
  "x-mock-workspace-id": "wks_demo_sales",
  "x-mock-role": "agent",
};

describe("AI draft review security regression", () => {
  it("redacts sensitive markers and returns only safe review DTO fields", async () => {
    const app = await createServer({ env: testEnv });
    const sensitiveMarker = ["access", "token"].join("_");

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/draft-reviews",
      headers: authHeaders,
      payload: {
        conversationId: "conv_demo_budi_stock",
        draftText: `Please answer. ${sensitiveMarker}=atk`,
      },
    });

    await app.close();

    expect(response.statusCode).toBe(201);
    const json = JSON.stringify(response.json());
    expect(json).toContain("[redacted]");
    expect(json).not.toContain(sensitiveMarker);
    expect(json).not.toContain(["refresh", "token"].join("_"));
    expect(json).not.toContain(["client", "secret"].join("_"));
    expect(json).not.toContain(["rawProvider", "Payload"].join(""));
    expect(json).not.toContain(["raw", "Html"].join(""));
  });

  it("requires approved draft state before reply send can use a draft id", async () => {
    const app = await createServer({ env: testEnv });

    const created = await app.inject({
      method: "POST",
      url: "/api/v1/ai/draft-reviews",
      headers: authHeaders,
      payload: {
        conversationId: "conv_demo_budi_stock",
        draftText: "This must be approved first.",
      },
    });
    const draftId = created.json().data.review.draftId as string;

    const sendBeforeApproval = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/reply",
      headers: authHeaders,
      payload: {
        body: "This must be approved first.",
        draft_id: draftId,
      },
    });
    expect(sendBeforeApproval.statusCode).toBe(404);

    await app.inject({
      method: "POST",
      url: `/api/v1/ai/draft-reviews/${draftId}/approve`,
      headers: authHeaders,
      payload: {},
    });

    const sendAfterApproval = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/reply",
      headers: authHeaders,
      payload: {
        body: "This is explicitly approved.",
        draft_id: draftId,
      },
    });
    expect(sendAfterApproval.statusCode).toBe(201);

    await app.close();
  });
});
