import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { buildExtensionSnapshotAiContext } from "../src/ai/extension-snapshot-ai-context-builder";
import type { ExtensionSnapshot } from "../src/extension/extension-snapshot-types";

const authContext = buildAuthContext({
  userId: "usr_owner",
  organizationId: "org_1",
  workspaceId: "wks_1",
  role: "owner",
});

const scope = { organizationId: "org_1", workspaceId: "wks_1" };

export function p17Snapshot(): ExtensionSnapshot {
  return {
    provider: "extension",
    officialApi: false,
    channel: "whatsapp",
    capturedAt: new Date("2026-07-24T00:00:00.000Z"),
    snapshotHash: "snapshot_hash_p17",
    chatTitle: "Customer chat",
    chatSubtitle: "Active conversation",
    sourceUrlOrigin: "https://web.example.test",
    messages: [
      {
        id: "m1",
        direction: "incoming",
        author: "Customer",
        text: "Need help with order.",
        timestampLabel: "Today",
        replyContextText: null,
      },
    ],
  };
}

describe("P17 extension snapshot AI context builder", () => {
  it("accepts sanitized extension snapshots and returns deterministic safe context", () => {
    const context = buildExtensionSnapshotAiContext({
      authContext,
      scope,
      snapshot: p17Snapshot(),
    });

    expect(context).toMatchObject({
      policyVersion: "p17-extension-snapshot-ai-context-v1",
      organizationId: "org_1",
      workspaceId: "wks_1",
      userId: "usr_owner",
      provider: "extension",
      officialApi: false,
      channel: "whatsapp",
      snapshotHash: "snapshot_hash_p17",
      chatTitle: "Customer chat",
    });
    expect(context.messages[0]?.untrustedText).toContain(
      "<untrusted_customer_text>",
    );
  });
});
