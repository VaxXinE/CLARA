import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { buildExtensionSnapshotAiContext } from "../src/ai/extension-snapshot-ai-context-builder";
import { p17Snapshot } from "./p17-extension-snapshot-ai-context-builder.test";

describe("P17 extension snapshot AI context budget", () => {
  it("enforces max message count and message size", () => {
    const snapshot = p17Snapshot();
    snapshot.messages = [
      { ...snapshot.messages[0]!, id: "m1", text: "first message" },
      { ...snapshot.messages[0]!, id: "m2", text: "second message is long" },
    ];

    const context = buildExtensionSnapshotAiContext({
      authContext: buildAuthContext({
        userId: "usr_owner",
        organizationId: "org_1",
        workspaceId: "wks_1",
        role: "owner",
      }),
      scope: { organizationId: "org_1", workspaceId: "wks_1" },
      snapshot,
      budget: { maxMessages: 1, maxMessageChars: 6 },
    });

    expect(context.messages).toHaveLength(1);
    expect(context.messages[0]?.id).toBe("m2");
    expect(context.messages[0]?.text).toBe("second");
    expect(context.contextBudgetSummary.truncatedMessages).toBe(1);
  });
});
