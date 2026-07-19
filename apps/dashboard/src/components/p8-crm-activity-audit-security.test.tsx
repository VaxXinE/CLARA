import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CrmActivityAuditReadinessPanel } from "./CrmActivityAuditReadinessPanel";
import workspaceSource from "./CrmCustomerWorkspace.tsx?raw";
import panelSource from "./CrmActivityAuditReadinessPanel.tsx?raw";

describe("P8 CRM activity audit dashboard security", () => {
  afterEach(() => {
    cleanup();
  });

  it("keeps audit visibility display-only and free of unsafe rendering", () => {
    const source = `${workspaceSource}\n${panelSource}`;

    for (const value of [
      "dangerouslySetInnerHTML",
      "access_token",
      "refresh_token",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawDom",
      "rawHtml",
      "rawPrompt",
    ]) {
      expect(source).not.toContain(value);
    }
  });

  it("does not render CRM audit mutation controls", () => {
    render(<CrmActivityAuditReadinessPanel />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();

    for (const label of [
      "Execute",
      "Apply",
      "Save",
      "Create Task",
      "Assign Owner",
      "Update Status",
      "Update Lifecycle",
      "Send Message",
      "Write Note",
    ]) {
      expect(screen.queryByRole("button", { name: label })).toBeNull();
    }
  });
});
