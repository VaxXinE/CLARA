import { describe, expect, it } from "vitest";
import apiClientSource from "../api/client.ts?raw";

describe("P17 AI secret boundary UI regression", () => {
  it("does not add frontend AI provider secret handling", () => {
    expect(apiClientSource).not.toContain("VITE_AI_API_KEY");
    expect(apiClientSource).not.toContain("AI_PROVIDER_API_KEY");
    expect(apiClientSource).not.toContain("raw_provider_response");
  });
});
