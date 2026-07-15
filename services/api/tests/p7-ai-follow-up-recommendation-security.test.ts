import { describe, expect, it } from "vitest";
import { createServer } from "../src/http/server";
import { loadEnv } from "../src/config/env";

const testEnv = loadEnv({
  NODE_ENV: "test",
  APP_NAME: "clara-api-test",
  HOST: "127.0.0.1",
  PORT: "3000",
  LOG_LEVEL: "silent",
  CORS_ORIGIN: "",
});

const headers = {
  "x-mock-user-id": "usr_demo_agent",
  "x-mock-organization-id": "org_demo",
  "x-mock-workspace-id": "wks_demo_sales",
  "x-mock-role": "agent",
};

describe("AI follow-up recommendation security", () => {
  it("returns safe 404 for cross-workspace conversation access", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/follow-up-recommendations",
      headers,
      payload: {
        conversationId: "conv_other_workspace",
      },
    });

    await app.close();

    expect(response.statusCode).toBe(404);
  });

  it("does not create tasks, schedules, reminders, CRM mutation, or sends", async () => {
    const app = await createServer({ env: testEnv });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/ai/follow-up-recommendations",
      headers,
      payload: {
        conversationId: "conv_demo_budi_stock",
        operatorInstruction: "Recommend only. Do not send.",
      },
    });

    await app.close();

    const body = JSON.stringify(response.json());
    expect(response.statusCode).toBe(201);
    expect(body).toContain("recommendation_only");
    expect(body).not.toContain("task_id");
    expect(body).not.toContain("schedule_id");
    expect(body).not.toContain("provider_message_id");
    expect(body).not.toContain("customer_updated");
    expect(body).not.toContain("rawPrompt");
  });
});
