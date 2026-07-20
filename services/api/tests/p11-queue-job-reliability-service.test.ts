import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { QueueJobReliabilityReadinessService } from "../src/reliability/queue-job-reliability-service";

describe("P11 queue job reliability readiness service", () => {
  it("returns workspace-scoped safe readiness without execution capability", () => {
    const service = new QueueJobReliabilityReadinessService();
    const readiness = service.getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_owner",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "owner",
      }),
      generatedAt: new Date("2026-07-20T00:00:00.000Z"),
    });

    expect(readiness).toMatchObject({
      workspaceId: "wks_demo_sales",
      generatedAt: "2026-07-20T00:00:00.000Z",
      phase: "p11",
      queueJobReliability: {
        workerImplemented: false,
        jobExecutionImplemented: false,
        autoRetryExecutionImplemented: false,
        destructiveCleanupImplemented: false,
      },
      safety: {
        readOnly: true,
        workspaceScoped: true,
        clientScopeIgnored: true,
        mutationAllowed: false,
        jobEnqueueAllowed: false,
        jobExecutionAllowed: false,
        retryExecutionAllowed: false,
        replayAllowed: false,
        purgeAllowed: false,
        outboundSendAllowed: false,
        billingSideEffectsAllowed: false,
        aiProviderCallAllowed: false,
      },
    });
  });
});
