import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P8 CRM activity audit extension boundary", () => {
  it("does not let the extension read, write, or bypass CRM audit internals", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
    expect("crmActivityAudit" in extensionBackground).toBe(false);
    expect("writeCrmAuditEvent" in extensionBackground).toBe(false);
    expect("readCrmAuditInternals" in extensionBackground).toBe(false);
    expect("bypassCrmAuditPolicy" in extensionBackground).toBe(false);
    expect("executeCrmAction" in extensionBackground).toBe(false);
  });
});
