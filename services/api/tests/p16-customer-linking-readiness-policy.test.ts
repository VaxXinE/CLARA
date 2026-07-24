import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { FixtureExtensionSnapshotRepository } from "../src/extension/extension-snapshot-repository";

const doc = readFileSync(
  join(
    process.cwd(),
    "../../docs/product/CLARA-P16-CUSTOMER-LINKING-READINESS-POLICY.md",
  ),
  "utf8",
);

describe("P16 customer linking readiness policy", () => {
  it("keeps customer linking readiness scoped and safe", async () => {
    const auth = buildAuthContext({
      userId: "usr_p16_agent",
      organizationId: "org_p16",
      workspaceId: "wks_p16",
      role: "agent",
    });
    const repository = new FixtureExtensionSnapshotRepository();
    const result = await repository.persistSnapshot({
      auth,
      scope: {
        organizationId: auth.organizationId,
        workspaceId: auth.workspaceId,
      },
      correlationId: "corr_p16",
      snapshot: {
        provider: "extension",
        officialApi: false,
        channel: "whatsapp",
        capturedAt: new Date("2026-07-24T00:00:00.000Z"),
        snapshotHash: "snapshot_hash_customer_ready",
        chatTitle: "Lead",
        chatSubtitle: null,
        sourceUrlOrigin: null,
        messages: [
          {
            id: "m1",
            direction: "incoming",
            author: "Lead",
            text: "hello",
            timestampLabel: null,
            replyContextText: null,
          },
        ],
      },
    });

    expect(result.customerId).toMatch(/^cust_extension_/);
    expect(doc).toContain(
      "customer linking is readiness-only unless existing safe patterns support it",
    );
    expect(doc).toContain("conversation linking is workspace-scoped");
  });
});
