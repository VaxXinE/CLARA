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

const scope = { organizationId: "org_1", workspaceId: "wks_1" };

describe("P17 extension snapshot AI context unsafe field rejection", () => {
  it("rejects raw DOM, raw HTML, provider payload, and webhook payload fields", () => {
    const unsafeSnapshot = {
      ...p17Snapshot(),
      rawHtml: "<main>unsafe</main>",
      messages: [
        {
          ...p17Snapshot().messages[0]!,
          rawProviderPayload: { unsafe: true },
        },
      ],
    };

    expect(() =>
      buildExtensionSnapshotAiContext({
        authContext,
        scope,
        snapshot: unsafeSnapshot,
      }),
    ).toThrow("Invalid request.");
  });
});
