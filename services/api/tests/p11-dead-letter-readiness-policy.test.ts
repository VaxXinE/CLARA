import { describe, expect, it } from "vitest";
import { getDeadLetterReadinessPolicy } from "../src/reliability/dead-letter-readiness-policy";

describe("P11 dead letter readiness policy", () => {
  it("defines safe review requirements without purge execution", () => {
    expect(getDeadLetterReadinessPolicy()).toEqual({
      deadLetterStateRequired: true,
      poisonMessageClassificationRequired: true,
      safeOperatorReviewRequired: true,
      purgeImplemented: false,
    });
  });
});
