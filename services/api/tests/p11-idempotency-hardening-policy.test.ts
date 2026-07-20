import { describe, expect, it } from "vitest";
import { getIdempotencyHardeningPolicy } from "../src/reliability/idempotency-hardening-policy";

describe("P11 idempotency hardening policy", () => {
  it("requires workspace scoped dedup and replay protection without replay execution", () => {
    expect(getIdempotencyHardeningPolicy()).toEqual({
      idempotencyKeyRequired: true,
      workspaceScopedDedupRequired: true,
      providerMessageScopedDedupRequired: true,
      replayProtectionRequired: true,
      replayExecutionImplemented: false,
    });
  });
});
