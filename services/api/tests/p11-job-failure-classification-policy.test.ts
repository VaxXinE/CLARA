import { describe, expect, it } from "vitest";
import { classifyJobFailure } from "../src/reliability/job-failure-classification-policy";

describe("P11 job failure classification policy", () => {
  it("maps job failures to safe reason codes", () => {
    expect(classifyJobFailure({ retryable: true })).toBe(
      "retryable_provider_failure",
    );
    expect(
      classifyJobFailure({ retryable: false, validationFailure: true }),
    ).toBe("non_retryable_validation_failure");
    expect(classifyJobFailure({ retryable: false, poisonMessage: true })).toBe(
      "poison_message",
    );
    expect(classifyJobFailure({ retryable: true, rateLimited: true })).toBe(
      "rate_limited",
    );
  });
});
