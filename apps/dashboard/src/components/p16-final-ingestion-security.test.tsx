import { describe, expect, it } from "vitest";
import source from "../App.tsx?raw";

describe("P16 final ingestion security dashboard boundary", () => {
  it("does not add dashboard mutation, token display, or unsafe HTML for extension ingestion", () => {
    expect(source).not.toContain("access_token");
    expect(source).not.toContain("refresh_token");
    expect(source).not.toContain("Authorization");
    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toMatch(/extension\/.*\/snapshots/);
  });
});
