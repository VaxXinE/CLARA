import appSource from "../App.tsx?raw";
import { describe, expect, it } from "vitest";

describe("P12 RC smoke readiness dashboard security", () => {
  it("does not add production launch, payment, provider, AI, or auto-send actions", () => {
    for (const pattern of [
      "redirectToCheckout",
      "chargeCustomer",
      "createInvoice",
      "deployProduction",
      "callRealAiProvider",
      "autoSend",
      "dangerouslySetInnerHTML",
    ]) {
      expect(appSource).not.toContain(pattern);
    }
  });
});
