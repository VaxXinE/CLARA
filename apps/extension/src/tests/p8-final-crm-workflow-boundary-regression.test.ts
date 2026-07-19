import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P8 final CRM workflow extension boundary regression", () => {
  it("does not expose CRM audit internals or mutation capability to the extension", () => {
    for (const key of [
      "crmMutationCapability",
      "crmActivityAudit",
      "readCrmAuditInternals",
      "writeCrmAuditEvent",
      "bypassCrmAuditPolicy",
      "autoSend",
      "autoCreateTask",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
