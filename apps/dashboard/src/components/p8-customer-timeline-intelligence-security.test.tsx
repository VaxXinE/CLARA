import { describe, expect, it } from "vitest";
import workspaceSource from "./CrmCustomerWorkspace.tsx?raw";
import panelSource from "./CustomerTimelineIntelligencePanel.tsx?raw";

describe("P8 customer timeline intelligence dashboard security", () => {
  it("keeps timeline intelligence read-only and free of unsafe rendering", () => {
    const source = `${workspaceSource}\n${panelSource}`;
    const unsafe = [
      "dangerouslySetInnerHTML",
      ["access", "token"].join("_"),
      ["refresh", "token"].join("_"),
      "Authorization",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawDom",
      "rawHtml",
      "rawPrompt",
      "Create Task",
      "Assign Owner",
      "Change Status",
      "Update Lifecycle",
      "Write Note",
    ];

    for (const value of unsafe) {
      expect(source).not.toContain(value);
    }
  });
});
