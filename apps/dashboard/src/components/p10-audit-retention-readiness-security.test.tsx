import { describe, expect, it } from "vitest";
import source from "./AuditRetentionReadinessPanel.tsx?raw";

describe("P10 audit retention dashboard security boundary", () => {
  it("has no mutation buttons or unsafe HTML rendering", () => {
    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toContain("Delete Data");
    expect(source).not.toContain("Legal Hold");
    expect(source).not.toContain("Run Retention Job");
    expect(source).not.toContain("Export");
    expect(source).not.toContain("Download");
  });
});
