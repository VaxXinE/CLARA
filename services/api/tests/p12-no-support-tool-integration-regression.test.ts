import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const docs = [
  "CLARA-P12-BETA-FEEDBACK-WORKFLOW.md",
  "CLARA-P12-BETA-INCIDENT-ESCALATION-POLICY.md",
].map((name) =>
  readFileSync(
    new URL(`../../../docs/product/${name}`, import.meta.url),
    "utf8",
  ),
);

describe("P12 no support tool integration regression", () => {
  it("states support workflow has no external integration or auto ticket creation", () => {
    const text = docs.join("\n");

    expect(text).toContain(
      "No external support tool integration happens in this PR",
    );
    expect(text).toContain(
      "No auto-send or external ticket creation happens in this PR",
    );
    expect(text).not.toContain("createZendeskTicket(");
    expect(text).not.toContain("sendSlackMessage(");
  });
});
