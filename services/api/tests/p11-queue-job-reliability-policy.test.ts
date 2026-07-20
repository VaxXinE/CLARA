import { describe, expect, it } from "vitest";
import { getQueueJobReliabilityControls } from "../src/reliability/queue-job-reliability-policy";

describe("P11 queue job reliability policy", () => {
  it("defines readiness controls without worker execution", () => {
    const controls = getQueueJobReliabilityControls();

    expect(controls.map((control) => control.controlKey)).toEqual([
      "queue_reliability_policy",
      "retry_backoff_policy",
      "idempotency_policy",
      "dead_letter_readiness",
      "no_worker_execution",
    ]);
    expect(controls).toContainEqual(
      expect.objectContaining({
        label: "No worker execution",
        status: "ready",
        severity: "critical",
      }),
    );
  });
});
