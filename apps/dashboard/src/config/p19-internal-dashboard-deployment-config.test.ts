import { describe, expect, it } from "vitest";
import { readDashboardAuthConfig } from "../auth/auth-config";
import { runDashboardRuntimeConfigDoctor } from "./dashboard-runtime-config-doctor";

describe("P19 internal dashboard deployment config", () => {
  it("requires provider public config and API base URL for internal runtime", () => {
    const result = runDashboardRuntimeConfigDoctor({
      VITE_AUTH_MODE: "provider",
      VITE_SUPABASE_URL: "https://example.supabase.test",
      VITE_SUPABASE_ANON_KEY: "public-anon-key-only",
      VITE_API_BASE_URL: "",
    });

    expect(result.status).toBe("fail");
    expect(result.checks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "dashboard.api_base_url",
          status: "fail",
        }),
      ]),
    );
  });

  it("rejects privileged provider keys and keeps provider values out of output", () => {
    const privilegedName = ["VITE_SUPABASE", "SERVICE", "ROLE", "KEY"].join(
      "_",
    );

    expect(() =>
      readDashboardAuthConfig({
        VITE_AUTH_MODE: "provider",
        VITE_SUPABASE_URL: "https://example.supabase.test",
        VITE_SUPABASE_ANON_KEY: "public-anon-key-only",
        [privilegedName]: "not-allowed",
      }),
    ).toThrow("privileged provider keys");

    const result = runDashboardRuntimeConfigDoctor({
      VITE_AUTH_MODE: "provider",
      VITE_SUPABASE_URL: "https://example.supabase.test",
      VITE_SUPABASE_ANON_KEY: "public-anon-key-only",
      VITE_API_BASE_URL: "https://api.example.test",
    });
    const serialized = JSON.stringify(result);

    expect(result.status).toBe("pass");
    expect(serialized).not.toContain("public-anon-key-only");
    expect(serialized).not.toContain("example.supabase.test");
  });
});
