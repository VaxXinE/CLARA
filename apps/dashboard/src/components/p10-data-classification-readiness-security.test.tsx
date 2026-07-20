import { describe, expect, it } from "vitest";
import source from "./DataClassificationReadinessPanel.tsx?raw";

describe("P10 data classification dashboard security boundary", () => {
  it("does not render raw restricted examples or mutation controls", () => {
    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toContain("raw provider payload");
    expect(source).not.toContain("raw webhook payload");
    expect(source).not.toContain("raw audit metadata");
    expect(source).not.toContain("Create Task");
    expect(source).not.toContain("Assign Owner");
    expect(source).not.toContain("Send Message");
  });
});
