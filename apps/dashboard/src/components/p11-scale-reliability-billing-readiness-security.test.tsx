import panelSource from "./ScaleReliabilityBillingReadinessPanel.tsx?raw";
import { describe, expect, it } from "vitest";

describe("P11 scale reliability billing dashboard security", () => {
  it("does not expose secrets, raw payloads, billing actions, quota enforcement, jobs, CRM mutation, outbound send, or unsafe HTML", () => {
    for (const pattern of [
      "dangerouslySetInnerHTML",
      "access_token",
      "refresh_token",
      "Authorization",
      "cookies",
      "client secret",
      "raw provider payload",
      "raw webhook payload",
      "raw customer messages",
      "raw audit metadata",
      "raw evidence",
      "Charge",
      "Create Invoice",
      "Upgrade Plan",
      "Downgrade Plan",
      "Cancel Subscription",
      "Enforce Quota",
      "Run Load Test",
      "Run Job",
      "Send Message",
      "Execute",
      "Apply",
    ]) {
      expect(panelSource).not.toContain(pattern);
    }
  });
});
