import panelSource from "./EnterpriseComplianceReadinessPanel.tsx?raw";
import { describe, expect, it } from "vitest";

describe("P10 enterprise compliance readiness dashboard security", () => {
  it("does not render raw data, secrets, mutation controls, export, or unsafe HTML", () => {
    for (const pattern of [
      "dangerouslySetInnerHTML",
      "access_token",
      "refresh_token",
      "Authorization",
      "providerCookie",
      "sessionCookie",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawAuditMetadata",
      "rawCustomerMessage",
      "rawDom",
      "rawHtml",
      "rawPrompt",
      ">Export<",
      ">Download<",
      ">Execute<",
      ">Apply<",
      ">Create Task<",
      ">Assign Owner<",
      ">Update Status<",
      ">Send Message<",
      ">Write Note<",
    ]) {
      expect(panelSource).not.toContain(pattern);
    }
  });
});
