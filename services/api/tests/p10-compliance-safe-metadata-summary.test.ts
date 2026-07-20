import { describe, expect, it } from "vitest";
import { summarizeComplianceMetadata } from "../src/enterprise/compliance-safe-metadata-summary";

describe("P10 compliance safe metadata summary", () => {
  it("separates allowed, redacted, and blocked metadata keys without returning values", () => {
    const summary = summarizeComplianceMetadata({
      conversation_id: "cnv_1",
      rawProviderPayload: { unsafe: true },
      access_token: "atk",
    });

    expect(summary).toEqual({
      allowedKeys: ["conversation_id"],
      redactedKeys: ["rawProviderPayload"],
      blockedKeys: ["access_token"],
      safe: false,
    });
    expect(JSON.stringify(summary)).not.toContain("unsafe");
    expect(JSON.stringify(summary)).not.toContain("atk");
  });
});
