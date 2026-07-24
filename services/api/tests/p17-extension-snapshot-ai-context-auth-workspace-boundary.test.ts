import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { buildExtensionSnapshotAiContext } from "../src/ai/extension-snapshot-ai-context-builder";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

const authContext = buildAuthContext({
  userId: "usr_owner",
  organizationId: "org_1",
  workspaceId: "wks_1",
  role: "owner",
});

describe("P17 extension snapshot AI context auth workspace boundary", () => {
  it("uses AuthContext and rejects mismatched trusted scope", () => {
    expect(() =>
      buildExtensionSnapshotAiContext({
        authContext,
        scope: { organizationId: "org_1", workspaceId: "wks_other" },
        snapshot: p17Snapshot(),
      }),
    ).toThrow("Invalid request.");
  });

  it("ignores client supplied workspace id as authority", () => {
    const context = buildExtensionSnapshotAiContext({
      authContext,
      scope: { organizationId: "org_1", workspaceId: "wks_1" },
      snapshot: p17Snapshot(),
      clientWorkspaceId: "wks_spoofed",
    });

    expect(context.workspaceId).toBe("wks_1");
  });
});
