import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P12 RC smoke extension boundary", () => {
  it("keeps extension manual-assisted and out of RC launch authority", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "releaseCandidateLaunch",
      "productionDeploy",
      "paymentProvider",
      "callRealAiProvider",
      "autoSend",
      "executeJob",
      "runBackup",
      "runRestore",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
