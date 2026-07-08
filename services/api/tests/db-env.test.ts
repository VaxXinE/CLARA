import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { getDatabaseUrl } from "../src/db/client";

describe("database environment", () => {
  it("accepts a postgres database url", () => {
    const env = loadEnv({
      NODE_ENV: "test",
      APP_NAME: "clara-api-test",
      HOST: "127.0.0.1",
      PORT: "3000",
      LOG_LEVEL: "silent",
      DATABASE_URL:
        "postgresql://postgres:postgres@127.0.0.1:5432/clara_api_test",
      CORS_ORIGIN: "",
    });

    expect(getDatabaseUrl(env)).toBe(
      "postgresql://postgres:postgres@127.0.0.1:5432/clara_api_test",
    );
  });

  it("rejects non-postgres database urls", () => {
    expect(() =>
      loadEnv({
        NODE_ENV: "test",
        APP_NAME: "clara-api-test",
        HOST: "127.0.0.1",
        PORT: "3000",
        LOG_LEVEL: "silent",
        DATABASE_URL: "mysql://root:root@127.0.0.1:3306/not_allowed",
        CORS_ORIGIN: "",
      }),
    ).toThrow("DATABASE_URL must use postgres:// or postgresql://");
  });

  it("requires database url only for database commands", () => {
    const env = loadEnv({
      NODE_ENV: "test",
      APP_NAME: "clara-api-test",
      HOST: "127.0.0.1",
      PORT: "3000",
      LOG_LEVEL: "silent",
      CORS_ORIGIN: "",
    });

    expect(() => getDatabaseUrl(env)).toThrow(
      "DATABASE_URL is required for database commands.",
    );
  });
});
