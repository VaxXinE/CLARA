import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-BETA-INCIDENT-ESCALATION-POLICY.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 beta incident escalation policy", () => {
  it("keeps escalation manual without notification side effects", () => {
    expect(doc).toContain("Escalation is documented manually");
    expect(doc).toContain(
      "does not send alerts, emails, Slack messages, Discord messages, or webhooks",
    );
  });
});
