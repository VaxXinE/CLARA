import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { ObservabilitySloAlertReadinessService } from "../src/reliability/observability-readiness-service";

const auth = buildAuthContext({
  userId: "usr_p11_obs",
  organizationId: "org_p11",
  workspaceId: "wks_p11",
  role: "owner",
});

describe("P11 final observability privacy regression", () => {
  it("returns aggregate observability readiness without raw telemetry", () => {
    const readiness = new ObservabilitySloAlertReadinessService().getReadiness({
      auth,
    });
    const encoded = JSON.stringify(readiness);

    expect(readiness.safety).toMatchObject({
      readOnly: true,
      mutationAllowed: false,
      alertSent: false,
      notificationSent: false,
      vendorProviderCalled: false,
      externalExportEnabled: false,
      rawTelemetryIncluded: false,
      secretsIncluded: false,
    });
    expect(encoded).not.toContain("access_token");
    expect(encoded).not.toContain("refresh_token");
    expect(encoded).not.toContain("Authorization");
    expect(encoded).not.toContain("client_secret");
    expect(encoded).not.toContain("raw provider payload");
    expect(encoded).not.toContain("raw webhook payload");
    expect(encoded).not.toContain("raw customer messages");
  });
});
