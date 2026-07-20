import { describe, expect, it } from "vitest";
import { getSessionPolicyControls } from "../src/enterprise/session-policy-readiness-policy";

describe("P10 session policy readiness policy", () => {
  it("defines safe session readiness controls without revocation execution", () => {
    const controls = getSessionPolicyControls();

    expect(controls.map((control) => control.controlKey)).toContain(
      "revocation_future_control",
    );
    expect(
      controls.find(
        (control) => control.controlKey === "revocation_future_control",
      ),
    ).toMatchObject({ status: "planned" });
  });
});
