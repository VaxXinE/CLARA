import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const docs = [
  "../../docs/product/CLARA-P19-REAL-INTERNAL-CRM-RUNTIME-ACTIVATION.md",
  "../../docs/product/CLARA-P19-MOCK-DEMO-USAGE-REMOVAL-GATE.md",
  "../../docs/product/CLARA-P19-PROVIDER-AUTH-INTERNAL-RUNTIME.md",
  "../../docs/product/CLARA-P19-FIRST-OWNER-WORKSPACE-BOOTSTRAP-RUNBOOK.md",
  "../../docs/product/CLARA-P19-INTERNAL-CRM-OPERATOR-RUNBOOK.md",
  "../../docs/product/CLARA-P19-INTERNAL-CRM-ADMIN-RUNBOOK.md",
  "../../docs/product/CLARA-P19-REAL-CRM-DATA-USAGE-POLICY.md",
  "../../docs/product/CLARA-P19-ROADMAP.md",
];

describe("P19 real internal CRM runtime docs", () => {
  it("keeps internal CRM runtime guardrails explicit", () => {
    const text = docs.map((path) => readFileSync(path, "utf8")).join("\n");

    for (const phrase of [
      "Internal team usage must use provider auth",
      "Mock/demo mode is dev/test only",
      "Demo role switcher is not used in provider mode",
      "Backend AuthContext/workspace membership is source of truth",
      "client-supplied workspaceId is not authoritative",
      "Viewer is read-only",
      "Owner/agent CRM mutation policy remains enforced",
      "CLARA is not public GA launch",
      "Billing/payment remains deferred",
      "Official WA/IG/TikTok APIs remain not activated",
      "Outbound auto-send remains disabled",
    ]) {
      expect(text).toContain(phrase);
    }
  });
});
