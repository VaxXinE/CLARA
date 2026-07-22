import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadEnv } from "../src/config/env";
import { createServer } from "../src/http/server";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

const agentHeaders = {
  "x-mock-user-id": "usr_demo_agent",
  "x-mock-organization-id": "org_demo",
  "x-mock-workspace-id": "wks_demo_sales",
  "x-mock-role": "agent",
};

describe("P13 customer notes billing side-effect regression", () => {
  it("does not return billing, payment, subscription, or quota data", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/customers/cust_demo_budi/notes",
      headers: agentHeaders,
      payload: { body: "Internal CRM note only." },
    });

    await app.close();

    const body = JSON.stringify(response.json()).toLowerCase();

    expect(response.statusCode).toBe(201);
    expect(body).not.toContain("payment");
    expect(body).not.toContain("checkout");
    expect(body).not.toContain("invoice");
    expect(body).not.toContain("subscription");
    expect(body).not.toContain("quota");
  });

  it("keeps customer notes runtime free from billing provider imports", () => {
    const serviceSource = readFileSync(
      path.resolve(__dirname, "../src/customers/customer-service.ts"),
      "utf8",
    ).toLowerCase();

    expect(serviceSource).not.toContain("stripe");
    expect(serviceSource).not.toContain("paypal");
    expect(serviceSource).not.toContain("checkout");
  });
});
