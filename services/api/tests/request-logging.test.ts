import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import {
  buildErrorLogContext,
  buildRequestLogContext,
} from "../src/http/middleware/request-logging";
import { AppError } from "../src/errors/app-error";

function createRequest(overrides?: {
  id?: string;
  method?: string;
  url?: string;
  startNs?: bigint;
  auth?: ReturnType<typeof buildAuthContext>;
}) {
  return {
    id: overrides?.id ?? "corr_demo_001",
    method: overrides?.method ?? "POST",
    url:
      overrides?.url ?? "/api/v1/conversations/conv_demo_budi_stock/reply?x=1",
    requestStartedAtNs:
      overrides?.startNs ?? process.hrtime.bigint() - BigInt(25_000_000),
    auth: overrides?.auth,
  };
}

describe("request logging", () => {
  it("builds safe request log context without query strings", () => {
    const auth = buildAuthContext({
      userId: "usr_demo_agent",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      role: "agent",
    });

    const result = buildRequestLogContext(
      createRequest({ auth }) as never,
      201,
    );

    expect(result).toMatchObject({
      method: "POST",
      path: "/api/v1/conversations/conv_demo_budi_stock/reply",
      status_code: 201,
      correlation_id: "corr_demo_001",
      organization_id: "org_demo",
      workspace_id: "wks_demo_sales",
      actor_user_id: "usr_demo_agent",
      actor_role: "agent",
    });
    expect(result.duration_ms).toBeGreaterThanOrEqual(0);
  });

  it("omits auth metadata when the request is unauthenticated", () => {
    const result = buildRequestLogContext(
      createRequest({
        method: "GET",
        url: "/health?check=true",
      }) as never,
      200,
    );

    expect(result).toMatchObject({
      method: "GET",
      path: "/health",
      status_code: 200,
      correlation_id: "corr_demo_001",
    });
    expect(result).not.toHaveProperty("organization_id");
    expect(result).not.toHaveProperty("actor_user_id");
  });

  it("builds safe error log context without raw error payloads", () => {
    const auth = buildAuthContext({
      userId: "usr_demo_agent",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      role: "agent",
    });
    const error = new AppError({
      statusCode: 502,
      appCode: "SEND_FAILED",
      message: "secret upstream token should never be logged",
      details: {
        token: "secret",
      },
    });

    const result = buildErrorLogContext({
      request: createRequest({ auth }) as never,
      statusCode: 502,
      error,
    });

    expect(result).toEqual({
      correlation_id: "corr_demo_001",
      method: "POST",
      path: "/api/v1/conversations/conv_demo_budi_stock/reply",
      status_code: 502,
      error_name: "AppError",
      error_code: "SEND_FAILED",
      organization_id: "org_demo",
      workspace_id: "wks_demo_sales",
      actor_user_id: "usr_demo_agent",
      actor_role: "agent",
    });
  });
});
