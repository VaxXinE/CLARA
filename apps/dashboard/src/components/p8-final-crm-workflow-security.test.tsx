import workspaceSource from "./CrmCustomerWorkspace.tsx?raw";
import activityAuditSource from "./CrmActivityAuditReadinessPanel.tsx?raw";
import profileSource from "./CustomerProfileIntelligencePanel.tsx?raw";
import timelineSource from "./CustomerTimelineIntelligencePanel.tsx?raw";
import actionSource from "./CustomerActionProposalPanel.tsx?raw";
import followUpSource from "./CustomerFollowUpProposalPanel.tsx?raw";
import ownerSource from "./CustomerOwnerAssignmentReadinessPanel.tsx?raw";
import lifecycleSource from "./CustomerLifecycleStatusReadinessPanel.tsx?raw";
import { describe, expect, it } from "vitest";

const source = [
  workspaceSource,
  activityAuditSource,
  profileSource,
  timelineSource,
  actionSource,
  followUpSource,
  ownerSource,
  lifecycleSource,
].join("\n");

describe("P8 final CRM workflow dashboard security", () => {
  it("does not render unsafe HTML or sensitive provider fields", () => {
    for (const pattern of [
      "dangerouslySetInnerHTML",
      "access_token",
      "refresh_token",
      "Authorization",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawDom",
      "rawHtml",
      "rawPrompt",
    ]) {
      expect(source).not.toContain(pattern);
    }
  });

  it("does not add CRM mutation controls", () => {
    for (const label of [
      "Execute",
      "Apply",
      "Save",
      "Create Task",
      "Schedule Task",
      "Assign Owner",
      "Update Status",
      "Update Lifecycle",
      "Send Message",
      "Write Note",
    ]) {
      expect(source).not.toContain(`>${label}<`);
    }
  });
});
