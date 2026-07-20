import enterprisePanelSource from "./EnterpriseComplianceReadinessPanel.tsx?raw";
import backupPanelSource from "./BackupRestoreReadinessPanel.tsx?raw";
import incidentPanelSource from "./IncidentResponseReadinessPanel.tsx?raw";
import evidencePanelSource from "./EvidenceReadinessPanel.tsx?raw";
import { describe, expect, it } from "vitest";

describe("P10 final enterprise dashboard security", () => {
  it("keeps enterprise UI safe-rendered and free of secrets, export, and mutation controls", () => {
    const source = [
      enterprisePanelSource,
      backupPanelSource,
      incidentPanelSource,
      evidencePanelSource,
    ].join("\n");

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
      "rawEvidence",
      "rawDom",
      "rawHtml",
      "rawPrompt",
      ">Export<",
      ">Download<",
      ">Execute<",
      ">Apply<",
      ">Revoke Session<",
      ">Force Logout<",
      ">Enable SSO<",
      ">Enable MFA<",
      ">Create Task<",
      ">Assign Owner<",
      ">Update Status<",
      ">Send Message<",
      ">Write Note<",
    ]) {
      expect(source).not.toContain(pattern);
    }
  });
});
