import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { AuthorizationError } from "../src/errors/app-error";
import { assertAnalyticsOperatorFilterAllowed } from "../src/analytics/analytics-operator-filter-policy";

describe("P9 operator filter policy", () => {
  it("allows owner-scoped operator filters and denies agent/viewer filters", () => {
    const owner = buildAuthContext({
      userId: "usr_demo_owner",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      role: "owner",
    });
    const agent = buildAuthContext({
      userId: "usr_demo_agent",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      role: "agent",
    });
    const viewer = buildAuthContext({
      userId: "usr_demo_viewer",
      organizationId: "org_demo",
      workspaceId: "wks_demo_sales",
      role: "viewer",
    });

    expect(() =>
      assertAnalyticsOperatorFilterAllowed({
        auth: owner,
        operatorId: "usr_demo_agent",
      }),
    ).not.toThrow();
    expect(() =>
      assertAnalyticsOperatorFilterAllowed({
        auth: agent,
        operatorId: "usr_demo_agent",
      }),
    ).toThrow(AuthorizationError);
    expect(() =>
      assertAnalyticsOperatorFilterAllowed({
        auth: viewer,
        operatorId: "usr_demo_agent",
      }),
    ).toThrow(AuthorizationError);
  });
});
