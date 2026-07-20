import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { QueueJobReliabilityReadinessResponse } from "../api/types";
import { QueueJobReliabilityReadinessPanel } from "./QueueJobReliabilityReadinessPanel";

const readiness: QueueJobReliabilityReadinessResponse = {
  workspaceId: "wks_demo_sales",
  generatedAt: "2026-07-20T00:00:00.000Z",
  phase: "p11",
  queueJobReliability: {
    queueReliabilityPolicyDefined: true,
    retryPolicyDefined: true,
    idempotencyPolicyDefined: true,
    deadLetterReadinessDefined: true,
    failureClassificationDefined: true,
    workerImplemented: false,
    jobExecutionImplemented: false,
    autoRetryExecutionImplemented: false,
    destructiveCleanupImplemented: false,
  },
  controls: [
    {
      controlKey: "queue_reliability_policy",
      label: "Queue reliability policy",
      description: "Queue reliability is policy-defined.",
      status: "ready",
      severity: "info",
      evidenceType: "policy",
    },
  ],
  retryBackoff: {
    boundedRetriesRequired: true,
    exponentialBackoffRequired: true,
    jitterRequired: true,
    maxAttemptsRequired: true,
    providerRateLimitRespectRequired: true,
    retryExecutionImplemented: false,
  },
  idempotency: {
    idempotencyKeyRequired: true,
    workspaceScopedDedupRequired: true,
    providerMessageScopedDedupRequired: true,
    replayProtectionRequired: true,
    replayExecutionImplemented: false,
  },
  deadLetter: {
    deadLetterStateRequired: true,
    poisonMessageClassificationRequired: true,
    safeOperatorReviewRequired: true,
    purgeImplemented: false,
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
    rawJobPayloadIncluded: false,
    rawCustomerMessagesIncluded: false,
    rawProviderPayloadIncluded: false,
    rawWebhookPayloadIncluded: false,
    outboundSendAllowed: false,
    billingSideEffectsAllowed: false,
    aiProviderCallAllowed: false,
  },
};

describe("QueueJobReliabilityReadinessPanel", () => {
  it("renders queue job readiness without mutation controls", () => {
    render(<QueueJobReliabilityReadinessPanel readiness={readiness} />);

    expect(
      screen.getByRole("region", { name: "Queue Job Reliability Readiness" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Queue / Job Reliability")).toBeInTheDocument();
    expect(screen.getByText("Queue reliability policy")).toBeInTheDocument();
    expect(screen.getByText(/no worker execution/i)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("does not render token, cookie, provider payload, or secret values", () => {
    const { container } = render(
      <QueueJobReliabilityReadinessPanel readiness={readiness} />,
    );

    expect(container.textContent).not.toContain("access token");
    expect(container.textContent).not.toContain("refresh token");
    expect(container.textContent).not.toContain("Authorization");
    expect(container.textContent).not.toContain("raw provider payload");
    expect(container.textContent).not.toContain("client secret");
  });
});
