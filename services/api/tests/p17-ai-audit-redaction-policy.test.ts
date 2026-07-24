import { describe, expect, it } from "vitest";
import { sanitizeAiProviderAuditMetadata } from "../src/ai/ai-audit-redaction-policy";

describe("P17 AI audit redaction policy", () => {
  it("keeps safe allowlisted metadata and drops raw provider data", () => {
    const sanitized = sanitizeAiProviderAuditMetadata({
      workspace_id: "workspace_1",
      model_provider: "openai",
      safe_reason_code: "blocked",
      raw_prompt: "customer body",
      raw_provider_payload: { unsafe: true },
      access_token: "t",
    });

    expect(sanitized).toEqual({
      workspace_id: "workspace_1",
      model_provider: "openai",
      safe_reason_code: "blocked",
    });
  });
});
