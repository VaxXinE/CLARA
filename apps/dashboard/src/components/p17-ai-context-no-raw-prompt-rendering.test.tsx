import { describe, expect, it } from "vitest";
import appSource from "../App.tsx?raw";

describe("P17 dashboard raw prompt rendering boundary", () => {
  it("does not render raw AI context, raw prompts, or unsafe HTML", () => {
    expect(appSource).not.toMatch(
      /raw_prompt|rawAiContext|raw_provider_payload/i,
    );
    expect(appSource).not.toContain("dangerouslySetInnerHTML");
  });
});
