import panelSource from "./PermissionAuditReadinessPanel.tsx?raw";
import { describe, expect, it } from "vitest";

describe("P10 permission audit readiness dashboard security", () => {
  it("does not render sensitive material or role mutation controls", () => {
    for (const unsafePattern of [
      "dangerouslySetInnerHTML",
      "access_token",
      "refresh_token",
      "Authorization",
      "client_secret",
      "raw Gmail payload",
      "provider raw error",
      "Update role",
      "Invite",
      "Delete user",
    ]) {
      expect(panelSource).not.toContain(unsafePattern);
    }
  });
});
