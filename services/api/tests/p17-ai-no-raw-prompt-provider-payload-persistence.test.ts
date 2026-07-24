import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const runtimeSource = [
  "ai-provider-runtime-config.ts",
  "ai-provider-config-doctor.ts",
  "ai-provider-secret-boundary.ts",
  "ai-model-allowlist.ts",
  "ai-cost-guardrail.ts",
  "ai-rate-limit-guardrail.ts",
  "ai-timeout-policy.ts",
  "ai-audit-redaction-policy.ts",
]
  .map((file) => readFileSync(join(process.cwd(), "src/ai", file), "utf8"))
  .join("\n");

describe("P17 AI no raw prompt/provider payload persistence", () => {
  it("does not add persistence for raw prompts or raw provider payloads", () => {
    expect(runtimeSource).not.toMatch(/persistRawPrompt|rawPromptRepository/);
    expect(runtimeSource).not.toMatch(/persistRawProviderPayload/);
    expect(runtimeSource).not.toMatch(/persistRawProviderResponse/);
  });
});
