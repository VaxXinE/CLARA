import appSource from "../App.tsx?raw";
import { describe, expect, it } from "vitest";

describe("P12 deployment readiness dashboard security", () => {
  it("does not add production deploy, rollback, billing, provider, or AI activation controls", () => {
    for (const pattern of [
      "deployProduction",
      "rollbackProduction",
      "redirectToCheckout",
      "chargeCustomer",
      "createInvoice",
      "callRealAiProvider",
      "autoSend",
      "dangerouslySetInnerHTML",
    ]) {
      expect(appSource).not.toContain(pattern);
    }
  });
});
