import { describe, expect, it } from "vitest";
import source from "./RedactionHardeningReadinessPanel.tsx?raw";

describe("P10 redaction hardening dashboard security boundary", () => {
  it("does not render secret values, raw samples, or mutation controls", () => {
    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toContain("access_token");
    expect(source).not.toContain("refresh_token");
    expect(source).not.toContain("Authorization header");
    expect(source).not.toContain("client_secret");
    expect(source).not.toContain("raw before");
    expect(source).not.toContain("raw after");
    expect(source).not.toContain("Apply");
  });
});
