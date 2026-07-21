import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScaleReliabilityBillingReadinessPanel } from "./ScaleReliabilityBillingReadinessPanel";

describe("P11 final dashboard reliability security", () => {
  it("does not render secrets, raw provider data, or mutation controls", () => {
    const { container } = render(<ScaleReliabilityBillingReadinessPanel />);
    const text = container.textContent ?? "";

    for (const forbidden of [
      "access_token",
      "refresh_token",
      "Authorization",
      "client_secret",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawCustomerMessages",
      "rawTelemetry",
      "rawLogs",
      "rawTraces",
      "rawMetricEvents",
      "Charge Customer",
      "Create Invoice",
      "Enforce Quota",
      "Run Load Test",
      "Send Outbound",
    ]) {
      expect(text).not.toContain(forbidden);
    }

    expect(container.querySelector("button")).toBeNull();
    expect(container.querySelector("form")).toBeNull();
  });
});
