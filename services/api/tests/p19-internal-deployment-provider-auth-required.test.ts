import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";

describe("P19 internal deployment provider auth requirement", () => {
  it("rejects internal CRM runtime without provider auth", () => {
    expect(() =>
      loadEnv({
        NODE_ENV: "development",
        INTERNAL_CRM_RUNTIME_ENABLED: "true",
        AUTH_MODE: "mock",
        MOCK_AUTH_ENABLED: "true",
        DATABASE_URL: "postgresql://user:hidden@db:5432/clara",
        CORS_ORIGIN: "https://dashboard.example.test",
      }),
    ).toThrow("INTERNAL_CRM_RUNTIME_ENABLED=true requires AUTH_MODE=provider");
  });
});
