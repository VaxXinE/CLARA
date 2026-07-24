import { describe, expect, it } from "vitest";
import appSource from "../App.tsx?raw";

describe("P17 AI provider config readiness dashboard boundary", () => {
  it("does not expose AI provider secrets or unsafe raw prompt rendering", () => {
    expect(appSource).not.toContain("VITE_AI_API_KEY");
    expect(appSource).not.toContain("NEXT_PUBLIC_AI_API_KEY");
    expect(appSource).not.toContain("PUBLIC_AI_API_KEY");
    expect(appSource).not.toContain("raw_prompt");
    expect(appSource).not.toContain("raw_provider_payload");
    expect(appSource).not.toContain("dangerouslySetInnerHTML");
  });
});
