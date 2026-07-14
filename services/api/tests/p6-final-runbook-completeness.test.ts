import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "../../../");

function readDoc(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

describe("P6 final runbook completeness", () => {
  it("documents observability and audit trail safety", () => {
    const docs = [
      readDoc("docs/product/CLARA-P6-OBSERVABILITY-SPEC.md"),
      readDoc("docs/product/CLARA-P6-AUDIT-TRAIL-SPEC.md"),
    ].join("\n");

    expect(docs).toContain("Observability");
    expect(docs).toContain("Audit Trail");
    expect(docs).toContain("safeReasonCode");
    expect(docs).toContain("correlationId");
    expect(docs).toContain("workspace-scoped");
    expect(docs).toContain("backend AuthContext");
    expect(docs).toContain("webhook_received_safe");
    expect(docs).toContain("webhook_rejected_safe");
    expect(docs).toContain("outbound_dead_lettered");
    expect(docs).toContain("outbound_retry_scheduled");
    expect(docs).toContain("provider_policy_blocked");
    expect(docs).toContain("no raw provider payload");
    expect(docs).toContain("no access token");
    expect(docs).toContain("no refresh token");
    expect(docs).toContain("no cookies");
  });

  it("documents P6 complete and P7 handoff", () => {
    const docs = [
      readDoc("docs/product/CLARA-P6-FINAL-SECURITY-AUDIT.md"),
      readDoc("docs/product/CLARA-P6-PRODUCTION-PROVIDER-RUNBOOK.md"),
      readDoc("docs/product/CLARA-P6-GO-LIVE-CHECKLIST.md"),
      readDoc("docs/product/CLARA-P6-TO-P7-HANDOFF.md"),
    ].join("\n");

    expect(docs).toContain("P6 complete");
    expect(docs).toContain("P7 handoff");
    expect(docs).toContain("extension bridge");
    expect(docs).toContain("prompt injection");
    expect(docs).toContain("no auto-send");
    expect(docs).toContain("known limitations accepted");
  });
});
