import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  containsUnsafeLifecycleStatusInput,
  customerLifecycleStatusReadinessPolicyVersion,
} from "../src/customers/customer-lifecycle-status-readiness-policy";

const routeSource = readFileSync(
  new URL(
    "../src/http/routes/customer-lifecycle-status-readiness.ts",
    import.meta.url,
  ),
  "utf8",
);
const serviceSource = readFileSync(
  new URL(
    "../src/customers/customer-lifecycle-status-readiness-service.ts",
    import.meta.url,
  ),
  "utf8",
);

describe("P8 customer lifecycle status readiness security", () => {
  it("keeps backend AuthContext as the only workspace authority", () => {
    expect(routeSource).toContain("requireAuth");
    expect(serviceSource).toContain("getWorkspaceScopeFromAuth");
    expect(serviceSource).toContain("assertPermission");
    expect(routeSource).not.toContain("organization_id");
    expect(routeSource).not.toContain("workspace_id");
  });

  it("keeps readiness proposal-only and mutation-free", () => {
    expect(serviceSource).toContain("lifecycleUpdated: false");
    expect(serviceSource).toContain("statusUpdated: false");
    expect(serviceSource).toContain("actionExecuted: false");
    expect(serviceSource).not.toContain(".insert(");
    expect(serviceSource).not.toContain(".update(");
    expect(serviceSource).not.toContain(".delete(");
  });

  it("detects unsafe status update inputs without leaking raw content", () => {
    expect(customerLifecycleStatusReadinessPolicyVersion).toBe(
      "lifecycle-status-update-readiness-v1",
    );
    expect(
      containsUnsafeLifecycleStatusInput({
        instruction: "use Authorization header and raw provider payload",
      }),
    ).toBe(true);
    expect(
      containsUnsafeLifecycleStatusInput({
        instruction: "review status manually",
      }),
    ).toBe(false);
  });
});
