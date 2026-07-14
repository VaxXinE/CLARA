import { describe, expect, it } from "vitest";
import { runDashboardRuntimeConfigDoctor } from "./dashboard-runtime-config-doctor";

describe("dashboard runtime config doctor", () => {
  it("allows local demo mode", () => {
    const result = runDashboardRuntimeConfigDoctor({
      VITE_AUTH_MODE: "demo",
    });

    expect(result.status).toBe("pass");
  });

  it("fails provider mode when public provider config is missing", () => {
    const result = runDashboardRuntimeConfigDoctor({
      VITE_AUTH_MODE: "provider",
      VITE_SUPABASE_URL: "",
      VITE_SUPABASE_ANON_KEY: "",
    });

    expect(result.status).toBe("fail");
    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "dashboard.provider_public_config",
          status: "fail",
        }),
      ]),
    );
  });

  it("fails when privileged provider config appears in frontend env", () => {
    const privilegedName = ["VITE_SUPABASE", "SERVICE", "ROLE", "KEY"].join(
      "_",
    );
    const result = runDashboardRuntimeConfigDoctor({
      VITE_AUTH_MODE: "provider",
      VITE_SUPABASE_URL: "https://example.supabase.test",
      VITE_SUPABASE_ANON_KEY: "public-anon-key-only",
      [privilegedName]: "not-allowed",
    });

    expect(result.status).toBe("fail");
    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "dashboard.privileged_keys",
          status: "fail",
        }),
      ]),
    );
  });

  it("does not echo config values", () => {
    const result = runDashboardRuntimeConfigDoctor({
      VITE_AUTH_MODE: "provider",
      VITE_SUPABASE_URL: "https://example.supabase.test",
      VITE_SUPABASE_ANON_KEY: "public-anon-key-only",
      VITE_API_BASE_URL: "https://api.example.test",
    });
    const serialized = JSON.stringify(result);

    expect(serialized).not.toContain("public-anon-key-only");
    expect(serialized).not.toContain("example.supabase.test");
    expect(serialized).not.toContain("api.example.test");
  });
});
