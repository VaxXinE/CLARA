import { describe, expect, it } from "vitest";
import { buildSafeContextPreview } from "../components/SafeContextPreview";

describe("safe context preview", () => {
  it("bounds preview text", () => {
    const preview = buildSafeContextPreview({
      context: "A".repeat(100),
      maxLength: 40,
    });

    expect(preview.length).toBeLessThanOrEqual(40);
    expect(preview).toContain("[truncated]");
  });
});
