import { describe, expect, it } from "vitest";
import { demoSeedData } from "../src/db/fixtures/demo-data";

describe("database demo fixtures", () => {
  it("includes demo and isolation workspaces", () => {
    expect(
      demoSeedData.organizations.map((organization) => organization.id),
    ).toEqual(expect.arrayContaining(["org_demo", "org_demo_other"]));
    expect(demoSeedData.workspaces.map((workspace) => workspace.id)).toEqual(
      expect.arrayContaining(["wks_demo_sales", "wks_demo_other"]),
    );
  });

  it("includes owner, agent, and viewer memberships", () => {
    expect(
      demoSeedData.workspaceMemberships.map((membership) => membership.role),
    ).toEqual(expect.arrayContaining(["owner", "agent", "viewer"]));
    expect(
      demoSeedData.workspaceMemberships.map((membership) => membership.status),
    ).toEqual(expect.arrayContaining(["active", "inactive"]));
  });

  it("uses safe fake email and contact domains only", () => {
    for (const user of demoSeedData.users) {
      expect(user.email.endsWith(".test")).toBe(true);
      expect(user.providerSubject?.startsWith("subject_demo_")).toBe(true);
    }

    for (const customer of demoSeedData.customers) {
      if (!customer.contactIdentifier) {
        continue;
      }

      expect(
        customer.contactIdentifier.endsWith(".test") ||
          /^\+62000000000\d+$/.test(customer.contactIdentifier),
      ).toBe(true);
    }
  });

  it("includes another workspace conversation for tenant isolation tests", () => {
    const conversationIds = demoSeedData.conversations.map(
      (conversation) => conversation.id,
    );

    expect(conversationIds).toContain("conv_other_workspace_secret");
  });

  it("starts audit log fixtures without sensitive payload data", () => {
    expect(demoSeedData.auditLogs).toEqual([]);
  });
});
