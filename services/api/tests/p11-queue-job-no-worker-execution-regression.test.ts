import { describe, expect, it } from "vitest";
import { QueueJobReliabilityReadinessService } from "../src/reliability/queue-job-reliability-service";
import { buildAuthContext } from "../src/auth/auth-context";

describe("P11 queue job no worker execution regression", () => {
  it("keeps readiness disconnected from enqueue, retry, replay, purge, and scheduler execution", () => {
    const readiness = new QueueJobReliabilityReadinessService().getReadiness({
      auth: buildAuthContext({
        userId: "usr_demo_agent",
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
        role: "agent",
      }),
    });

    expect(readiness.queueJobReliability).toMatchObject({
      workerImplemented: false,
      jobExecutionImplemented: false,
      autoRetryExecutionImplemented: false,
      destructiveCleanupImplemented: false,
    });
    expect(readiness.safety).toMatchObject({
      jobEnqueueAllowed: false,
      jobExecutionAllowed: false,
      retryExecutionAllowed: false,
      replayAllowed: false,
      purgeAllowed: false,
    });
  });
});
