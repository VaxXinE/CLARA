import { describe, expect, it } from "vitest";
import appSource from "../App.tsx?raw";
import workspaceSource from "./ConversationWorkspace.tsx?raw";
import dashboardReadme from "../../README.md?raw";

describe("P15 internal beta operating rules security", () => {
  it("does not add unsafe rendering or mutation powers to the dashboard", () => {
    const readme = dashboardReadme.replace(/\s+/g, " ");
    const source = `${appSource}\n${workspaceSource}`;

    expect(readme).toContain(
      "secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data must not be included",
    );
    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toMatch(/submitFeedback|createSupportTicket/i);
    expect(source).not.toMatch(/deployProduction|rollbackProduction/i);
    expect(source).not.toMatch(/createCheckoutSession|createInvoice|stripe/i);
    expect(source).not.toMatch(/runAiAction|autoSend|sendNotification/i);
  });
});
