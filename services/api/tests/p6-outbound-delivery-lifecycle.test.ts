import { describe, expect, it } from "vitest";
import {
  beginOutboundSend,
  completeOutboundAttempt,
} from "../src/channels/outbound/outbound-delivery-lifecycle";

describe("P6 outbound delivery lifecycle", () => {
  it("moves queued deliveries into sending", () => {
    expect(beginOutboundSend("queued")).toEqual({
      status: "sending",
    });
  });

  it("marks successful attempts as sent", () => {
    expect(
      completeOutboundAttempt({
        succeeded: true,
        attemptNumber: 1,
        maxAttempts: 3,
      }),
    ).toEqual({
      status: "sent",
    });
  });

  it("moves transient failures to retrying before max attempts", () => {
    expect(
      completeOutboundAttempt({
        succeeded: false,
        attemptNumber: 1,
        maxAttempts: 3,
        failureKind: "transient",
      }),
    ).toMatchObject({
      status: "retrying",
      safeReasonCode: "provider_unavailable",
    });
  });

  it("moves exhausted transient failures to dead_letter", () => {
    expect(
      completeOutboundAttempt({
        succeeded: false,
        attemptNumber: 3,
        maxAttempts: 3,
        failureKind: "transient",
      }),
    ).toMatchObject({
      status: "dead_letter",
      safeReasonCode: "max_attempts_exceeded",
    });
  });

  it("does not restart terminal delivery statuses", () => {
    expect(beginOutboundSend("sent")).toEqual({
      status: "sent",
    });
    expect(beginOutboundSend("dead_letter")).toMatchObject({
      status: "dead_letter",
    });
  });
});
