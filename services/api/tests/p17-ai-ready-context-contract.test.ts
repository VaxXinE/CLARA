import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { buildExtensionSnapshotAiContext } from "../src/ai/extension-snapshot-ai-context-builder";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 AI-ready context contract", () => {
  it("is deterministic and excludes unsafe provider/provider-response data", () => {
    const input = {
      authContext: buildAuthContext({
        userId: "usr_owner",
        organizationId: "org_1",
        workspaceId: "wks_1",
        role: "owner" as const,
      }),
      scope: { organizationId: "org_1", workspaceId: "wks_1" },
      snapshot: p17Snapshot(),
    };

    const first = buildExtensionSnapshotAiContext(input);
    const second = buildExtensionSnapshotAiContext(input);
    const serialized = JSON.stringify(first);

    expect(first).toEqual(second);
    expect(serialized).not.toContain("rawProviderPayload");
    expect(serialized).not.toContain("rawAiProviderResponse");
    expect(serialized).not.toContain("authorization=");
  });
});
