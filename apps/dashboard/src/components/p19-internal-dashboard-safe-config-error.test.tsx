import { describe, expect, it } from "vitest";
import { readDashboardAuthConfig } from "../auth/auth-config";

describe("P19 internal dashboard safe config error", () => {
  it("fails closed for provider mode without public provider config", () => {
    expect(() =>
      readDashboardAuthConfig({
        VITE_AUTH_MODE: "provider",
        VITE_SUPABASE_URL: "",
        VITE_SUPABASE_ANON_KEY: "",
      }),
    ).toThrow("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required");
  });
});
