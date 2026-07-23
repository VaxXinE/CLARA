import { describe, expect, it } from "vitest";
import appSource from "../App.tsx?raw";
import workspaceSource from "./ConversationWorkspace.tsx?raw";

describe("P14 final internal beta UI regression", () => {
  it("does not add launch, billing, support, provider, AI, or outbound mutations", () => {
    const source = `${appSource}\n${workspaceSource}`;

    expect(source).not.toMatch(/createCheckoutSession|createInvoice|stripe/i);
    expect(source).not.toMatch(/submitFeedback|createSupportTicket/i);
    expect(source).not.toMatch(/deployProduction|rollbackProduction/i);
    expect(source).not.toMatch(/activateProvider|runAiAction|autoSend/i);
    expect(source).not.toMatch(/sendNotification|sendExternal/i);
  });
});
