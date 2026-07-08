import { describe, expect, it, vi } from "vitest";
import type { Database } from "../src/db/client";
import { loadEnv } from "../src/config/env";
import { DrizzleCustomerRepository } from "../src/customers/customer-db-repository";
import { createAppServiceContainer } from "../src/app/service-container";

function createFakeDatabase(row: unknown): Database {
  return {
    query: {
      customers: {
        findFirst: vi.fn(async () => row),
      },
    },
  } as unknown as Database;
}

describe("DrizzleCustomerRepository", () => {
  it("maps a scoped customer row into the customer profile record", async () => {
    const db = createFakeDatabase({
      id: "cust_demo_budi",
      displayName: "Budi Santoso",
      contactIdentifier: "+620000000001",
      source: "whatsapp_demo",
      status: "new",
      notesSummary: "Interested in product availability.",
      lastInteractionAt: new Date("2026-07-07T09:00:00.000Z"),
      createdAt: new Date("2026-07-07T10:00:00.000Z"),
      updatedAt: new Date("2026-07-07T10:00:00.000Z"),
    });
    const repository = new DrizzleCustomerRepository(db);

    const result = await repository.findByIdScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "cust_demo_budi",
    );

    expect(result).toMatchObject({
      id: "cust_demo_budi",
      displayName: "Budi Santoso",
      contactIdentifier: "+620000000001",
      source: "whatsapp_demo",
      status: "new",
      notesSummary: "Interested in product availability.",
    });
    expect(result?.lastInteractionAt?.toISOString()).toBe(
      "2026-07-07T09:00:00.000Z",
    );
  });

  it("returns null when the scoped customer is not found", async () => {
    const repository = new DrizzleCustomerRepository(createFakeDatabase(null));

    const result = await repository.findByIdScoped(
      {
        organizationId: "org_demo",
        workspaceId: "wks_demo_sales",
      },
      "cust_missing_01",
    );

    expect(result).toBeNull();
  });
});

describe("app service container customer repository selection", () => {
  it("blocks fixture fallback in production when DATABASE_URL is missing", () => {
    const env = loadEnv({
      NODE_ENV: "production",
      APP_NAME: "clara-api",
      HOST: "127.0.0.1",
      PORT: "3000",
      LOG_LEVEL: "info",
      AUTH_MODE: "provider",
      AUTH_PROVIDER: "supabase",
      MOCK_AUTH_ENABLED: "false",
      SUPABASE_AUTH_JWKS_URL: "https://example.supabase.test/auth/v1/jwks",
      SUPABASE_AUTH_ISSUER: "https://example.supabase.test/auth/v1",
      CORS_ORIGIN: "",
    });

    expect(() => createAppServiceContainer(env)).toThrow(
      "DATABASE_URL is required in production so conversation, customer, and related APIs do not fall back to fixture data.",
    );
  });
});
