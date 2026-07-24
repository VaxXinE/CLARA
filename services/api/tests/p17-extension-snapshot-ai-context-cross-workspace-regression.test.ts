import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { buildExtensionSnapshotAiContext } from "../src/ai/extension-snapshot-ai-context-builder";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 extension snapshot AI context cross-workspace regression", () => {
  it("rejects organization scope that does not match backend AuthContext", () => {
    expect(() =>
      buildExtensionSnapshotAiContext({
        authContext: buildAuthContext({
          userId: "usr_owner",
          organizationId: "org_1",
          workspaceId: "wks_1",
          role: "owner",
        }),
        scope: { organizationId: "org_other", workspaceId: "wks_1" },
        snapshot: p17Snapshot(),
      }),
    ).toThrow("Invalid request.");
  });
});
