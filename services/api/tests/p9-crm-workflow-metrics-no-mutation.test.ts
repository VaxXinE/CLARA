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

const ownerHeaders = {
  "x-mock-user-id": "usr_demo_owner",
  "x-mock-organization-id": "org_demo",
  "x-mock-workspace-id": "wks_demo_sales",
  "x-mock-role": "owner",
};

describe("P9 CRM workflow analytics no-mutation regression", () => {
  it("keeps CRM workflow and KPI dashboard endpoints read-only", async () => {
    const app = await createServer({ env: testEnv });

    const responses = await Promise.all(
      ["/api/v1/analytics/crm-workflow", "/api/v1/analytics/kpi-dashboard"].map(
        (url) =>
          app.inject({
            method: "GET",
            url,
            headers: ownerHeaders,
          }),
      ),
    );

    await app.close();

    const crmWorkflowResponse = responses[0];
    const kpiDashboardResponse = responses[1];

    expect(crmWorkflowResponse).toBeDefined();
    expect(kpiDashboardResponse).toBeDefined();
    expect(crmWorkflowResponse!.json().safety).toMatchObject({
      readOnly: true,
      mutationAllowed: false,
      actionExecuted: false,
      crmMutationExecuted: false,
      taskCreated: false,
      customerNoteWritten: false,
      ownerAssigned: false,
      lifecycleStatusUpdated: false,
      outboundSent: false,
      customerLevelDrilldown: false,
      reportExported: false,
    });
    expect(kpiDashboardResponse!.json().safety).toMatchObject({
      readOnly: true,
      exportEnabled: false,
      drilldownEnabled: false,
      mutationAllowed: false,
    });
  });
});
