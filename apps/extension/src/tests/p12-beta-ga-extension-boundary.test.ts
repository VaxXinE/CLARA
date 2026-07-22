import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P12 Beta / GA extension boundary", () => {
  it("keeps extension scope manual and out of Beta / GA launch authority", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "productionDeploy",
      "gaLaunch",
      "chargeCustomer",
      "createInvoice",
      "autoSend",
      "runBackup",
      "runRestore",
      "callRealAiProvider",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
