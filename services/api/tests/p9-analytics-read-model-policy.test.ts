import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { getAnalyticsWorkspaceScope } from "../src/analytics/analytics-read-model-policy";

describe("P9 analytics read model policy", () => {
  it("uses Backend AuthContext as workspace authority", () => {
    const auth = buildAuthContext({
      userId: "usr_owner",
      organizationId: "org_auth",
      workspaceId: "wks_auth",
      role: "owner",
    });

    expect(getAnalyticsWorkspaceScope(auth)).toEqual({
      workspaceId: "wks_auth",
    });
  });
});
