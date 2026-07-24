import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = readFileSync(
  resolve(root, "docs/product/CLARA-P18-RUNTIME-TRIAL-STOP-ROLLBACK-DECISION.md"),
  "utf8",
);

describe("P18 runtime trial stop rollback decision", () => {
  it("keeps stop criteria and manual rollback visible without launch claims", () => {
    expect(text).toContain("P18-PR-03 is current");
    expect(text).toContain("stop_trial");
    expect(text).toContain("rollback_runtime_change");
    expect(text).toContain("manual_rollback_reference");
    expect(text).toContain("Stop criteria and manual rollback references must remain visible");
    expect(text).toContain("P18 is not public SaaS launch");
    expect(text).toContain("P18 is not production deployment");
    expect(text).toContain("Outbound auto-send remains disabled");
  });
});
