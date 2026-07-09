import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";

function authHeaders(input: {
  userId: string;
  organizationId: string;
  workspaceId: string;
  role: "owner" | "agent" | "viewer";
}) {
  return {
    "x-mock-user-id": input.userId,
    "x-mock-organization-id": input.organizationId,
    "x-mock-workspace-id": input.workspaceId,
    "x-mock-role": input.role,
  };
}

describe("request body size limits", () => {
  it("returns a safe 413 when the request payload exceeds the configured body limit", async () => {
    const env = loadEnv({
      NODE_ENV: "test",
      APP_NAME: "clara-api-test",
      HOST: "127.0.0.1",
      PORT: "3000",
      LOG_LEVEL: "silent",
      REQUEST_BODY_LIMIT_BYTES: "64",
      CORS_ORIGIN: "",
    });
    const app = await createServer({ env });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/conversations/conv_demo_budi_stock/reply",
      headers: authHeaders({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
      payload: {
        body: "x".repeat(256),
      },
    });

    await app.close();

    expect(response.statusCode).toBe(413);
    expect(response.json()).toMatchObject({
      error: {
        code: "PAYLOAD_TOO_LARGE",
        message: "Request payload is too large.",
      },
    });
    expect(response.json().error.correlation_id).toEqual(expect.any(String));
  });
});
