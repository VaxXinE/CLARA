import { describe, expect, it } from "vitest";
import { QueueJobReliabilityReadinessService } from "../src/reliability/queue-job-reliability-service";
import { buildAuthContext } from "../src/auth/auth-context";

describe("P11 queue job no mutation regression", () => {
  it("does not permit CRM, outbound, billing, or AI side effects", () => {
    const readiness = new QueueJobReliabilityReadinessService().getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_owner",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "owner",
      }),
    });

    expect(readiness.safety).toMatchObject({
      mutationAllowed: false,
      outboundSendAllowed: false,
      billingSideEffectsAllowed: false,
      aiProviderCallAllowed: false,
    });
  });
});
