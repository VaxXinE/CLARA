import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const docs = [
  "CLARA-P12-BETA-FEEDBACK-WORKFLOW.md",
  "CLARA-P12-SUPPORT-TRIAGE-RUNBOOK.md",
  "CLARA-P12-GA-BLOCKER-REVIEW-CHECKLIST.md",
].map((name) =>
  readFileSync(
    new URL(`../../../docs/product/${name}`, import.meta.url),
    "utf8",
  ),
);

describe("P12 no beta feedback provider side effect", () => {
  it("states support workflow does not activate provider payment AI or outbound side effects", () => {
    const text = docs.join("\n");

    expect(text).toContain(
      "No provider/payment/AI/outbound activation happens in this PR",
    );
    expect(text).not.toContain("chargeCustomer(");
    expect(text).not.toContain("callRealAiProvider(");
    expect(text).not.toContain("autoSend(");
  });
});
