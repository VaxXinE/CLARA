import { describe, expect, it } from "vitest";
import { readDashboardAuthConfig } from "./auth-config";

describe("dashboard auth config", () => {
  it("defaults to local demo mode", () => {
    expect(readDashboardAuthConfig({})).toEqual({
      mode: "demo",
    });
  });

  it("requires provider public config in provider mode", () => {
    expect(() =>
      readDashboardAuthConfig({
        VITE_AUTH_MODE: "provider",
        VITE_SUPABASE_URL: "",
        VITE_SUPABASE_ANON_KEY: "",
      }),
    ).toThrow("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required");
  });

  it("accepts only public Supabase anon key config in provider mode", () => {
    const config = readDashboardAuthConfig({
      VITE_AUTH_MODE: "provider",
      VITE_SUPABASE_URL: "https://example.supabase.test",
      VITE_SUPABASE_ANON_KEY: "public-anon-key-only",
    });
    const serialized = JSON.stringify(config).toLowerCase();

    expect(config.mode).toBe("provider");
    expect(serialized).not.toContain("service_role");
    expect(serialized).not.toContain("service-role");
    expect(serialized).not.toContain(["client", "secret"].join("_"));
  });
});
