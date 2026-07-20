import { describe, expect, it } from "vitest";
import {
  getIncidentResponseControls,
  getIncidentSeverityLevels,
} from "../src/enterprise/incident-response-readiness-policy";

describe("P10 incident response readiness policy", () => {
  it("defines severity levels and manual response controls", () => {
    expect(getIncidentSeverityLevels()).toEqual([
      "sev1",
      "sev2",
      "sev3",
      "sev4",
    ]);

    const keys = getIncidentResponseControls().map(
      (control) => control.controlKey,
    );
    expect(keys).toContain("severity_model");
    expect(keys).toContain("containment_checklist");
    expect(keys).toContain("post_incident_review");
  });
});
