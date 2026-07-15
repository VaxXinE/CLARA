import { describe, expect, it } from "vitest";
import {
  customerTimelineEventSeverities,
  customerTimelineEventSources,
  customerTimelineEventTypes,
  customerTimelineIntelligencePolicyVersion,
} from "../src/customers/customer-timeline-intelligence-policy";

describe("P8 customer timeline intelligence policy", () => {
  it("defines a read-only timeline policy surface", () => {
    expect(customerTimelineIntelligencePolicyVersion).toBe(
      "customer-timeline-intelligence-read-model-v1",
    );
    expect(customerTimelineEventTypes).toContain("inbound_message");
    expect(customerTimelineEventTypes).toContain("outbound_reply");
    expect(customerTimelineEventSources).toContain("conversation");
    expect(customerTimelineEventSources).toContain("reply");
    expect(customerTimelineEventSeverities).toContain("attention");
  });
});
