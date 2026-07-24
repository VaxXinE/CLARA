import { describe, expect, it } from "vitest";
import envExample from "../../.env.example?raw";
import dashboardReadme from "../../README.md?raw";
import aiReadyContextContract from "../../../../docs/product/CLARA-P17-AI-READY-CONTEXT-CONTRACT.md?raw";

describe("P17 dashboard AI context builder readiness security", () => {
  it("does not expose frontend AI provider secret configuration", () => {
    expect(envExample).not.toMatch(
      /VITE_AI_API_KEY|NEXT_PUBLIC_AI_API_KEY|PUBLIC_AI_API_KEY/,
    );
    expect(dashboardReadme).toMatch(
      /AI provider secrets must not be exposed to\s+dashboard or extension/,
    );
    expect(dashboardReadme).toContain("P17-PR-02 is current");
  });

  it("documents that AI-ready context is backend-built only", () => {
    expect(aiReadyContextContract).toContain(
      "AI-ready context must come only from sanitized/redacted extension snapshots",
    );
    expect(aiReadyContextContract).toContain(
      "Client-supplied workspaceId is not authoritative",
    );
  });
});
