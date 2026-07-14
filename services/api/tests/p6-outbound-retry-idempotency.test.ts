import { describe, expect, it } from "vitest";
import {
  classifyOutboundProviderFailure,
  getOutboundRetryDecision,
} from "../src/channels/outbound/outbound-retry-policy";
import {
  buildOutboundIdempotencyKey,
  MemoryOutboundIdempotencyStore,
} from "../src/channels/outbound/outbound-idempotency";

describe("P6 outbound retry and idempotency policy", () => {
  it("classifies transient provider failures for retry", () => {
    expect(classifyOutboundProviderFailure({ statusCode: 429 })).toBe(
      "transient",
    );
    expect(
      getOutboundRetryDecision({
        attemptNumber: 1,
        maxAttempts: 3,
        failureKind: "transient",
        baseBackoffMs: 250,
      }),
    ).toMatchObject({
      shouldRetry: true,
      nextStatus: "retrying",
      backoffMs: 250,
    });
  });

  it("dead-letters transient failures after max attempts", () => {
    expect(
      getOutboundRetryDecision({
        attemptNumber: 3,
        maxAttempts: 3,
        failureKind: "transient",
      }),
    ).toMatchObject({
      shouldRetry: false,
      nextStatus: "dead_letter",
      safeReasonCode: "max_attempts_exceeded",
    });
  });

  it("does not retry permanent provider failures", () => {
    expect(classifyOutboundProviderFailure({ statusCode: 400 })).toBe(
      "permanent",
    );
    expect(
      getOutboundRetryDecision({
        attemptNumber: 1,
        maxAttempts: 3,
        failureKind: "permanent",
      }),
    ).toMatchObject({
      shouldRetry: false,
      nextStatus: "failed",
      safeReasonCode: "provider_rejected",
    });
  });

  it("prevents duplicate sends with workspace-scoped idempotency", () => {
    const store = new MemoryOutboundIdempotencyStore();
    const input = {
      organizationId: "org_1",
      workspaceId: "ws_1",
      channel: "gmail",
      channelAccountId: "account_1",
      idempotencyKey: "human-click-1",
    };

    expect(store.reserve(input)).toMatchObject({
      reserved: true,
      duplicate: false,
    });
    expect(store.reserve(input)).toMatchObject({
      reserved: false,
      duplicate: true,
    });
    expect(
      store.reserve({
        ...input,
        workspaceId: "ws_2",
      }),
    ).toMatchObject({
      reserved: true,
      duplicate: false,
    });
  });

  it("does not put message body or token material into idempotency key", () => {
    const key = buildOutboundIdempotencyKey({
      organizationId: "org_1",
      workspaceId: "ws_1",
      channel: "whatsapp",
      channelAccountId: "account_1",
      idempotencyKey: "body-with-sensitive-text",
    });

    expect(key).not.toContain("body-with-sensitive-text");
    expect(key).not.toContain("access_token");
    expect(key).not.toContain("refresh_token");
  });
});
