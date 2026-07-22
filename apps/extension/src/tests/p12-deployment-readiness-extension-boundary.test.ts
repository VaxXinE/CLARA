import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";

describe("P12 deployment readiness extension boundary", () => {
  it("keeps extension out of production deploy and rollback authority", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });

    for (const key of [
      "deployProduction",
      "rollbackProduction",
      "executeJob",
      "sendAlert",
      "runBackup",
      "runRestore",
      "callRealAiProvider",
      "autoSend",
    ]) {
      expect(key in extensionBackground).toBe(false);
    }
  });
});
