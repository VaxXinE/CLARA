import { describe, expect, it } from "vitest";
import { QueueJobReliabilityReadinessService } from "../src/reliability/queue-job-reliability-service";
import { buildAuthContext } from "../src/auth/auth-context";

describe("P11 queue job security boundary", () => {
  it("returns only safe summary flags and no sensitive sample values", () => {
    const readiness = new QueueJobReliabilityReadinessService().getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_viewer",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "viewer",
      }),
    });
    const serialized = JSON.stringify(readiness);

    expect(readiness.safety).toMatchObject({
      rawJobPayloadIncluded: false,
      rawCustomerMessagesIncluded: false,
      rawProviderPayloadIncluded: false,
      rawWebhookPayloadIncluded: false,
    });
    expect(serialized).not.toContain("Bearer ");
    expect(serialized).not.toContain("client_secret");
    expect(serialized).not.toContain("providerCookie");
    expect(serialized).not.toContain("sessionCookie");
  });
});
