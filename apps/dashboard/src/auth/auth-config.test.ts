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
    const privilegedKeyName = ["service", "role"].join("_");
    const privilegedKeyLabel = ["service", "role"].join("-");

    expect(config.mode).toBe("provider");
    expect(serialized).not.toContain(privilegedKeyName);
    expect(serialized).not.toContain(privilegedKeyLabel);
    expect(serialized).not.toContain(["client", "secret"].join("_"));
  });

  it("rejects privileged provider key names in frontend config", () => {
    const privilegedKeyName = ["VITE_SUPABASE", "SERVICE", "ROLE", "KEY"].join(
      "_",
    );

    expect(() =>
      readDashboardAuthConfig({
        VITE_AUTH_MODE: "provider",
        VITE_SUPABASE_URL: "https://example.supabase.test",
        VITE_SUPABASE_ANON_KEY: "public-anon-key-only",
        [privilegedKeyName]: "not-allowed",
      }),
    ).toThrow("privileged provider keys are not allowed");
  });

  it("rejects privileged provider key values in frontend config", () => {
    const privilegedKeyValue = ["example", "service", "role", "value"].join(
      "_",
    );

    expect(() =>
      readDashboardAuthConfig({
        VITE_AUTH_MODE: "provider",
        VITE_SUPABASE_URL: "https://example.supabase.test",
        VITE_SUPABASE_ANON_KEY: privilegedKeyValue,
      }),
    ).toThrow("privileged provider keys are not allowed");
  });
});
