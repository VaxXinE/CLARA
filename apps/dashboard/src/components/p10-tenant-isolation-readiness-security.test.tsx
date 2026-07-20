import panelSource from "./TenantIsolationReadinessPanel.tsx?raw";
import { describe, expect, it } from "vitest";

describe("P10 tenant isolation readiness dashboard security", () => {
  it("does not render sensitive material or mutation controls", () => {
    for (const unsafePattern of [
      "dangerouslySetInnerHTML",
      "access_token",
      "refresh_token",
      "Authorization",
      "client_secret",
      "raw Gmail payload",
      "provider raw error",
      "Apply",
      "Export",
    ]) {
      expect(panelSource).not.toContain(unsafePattern);
    }
  });
});
