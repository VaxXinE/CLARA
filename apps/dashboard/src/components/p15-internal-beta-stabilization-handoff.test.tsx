import { describe, expect, it } from "vitest";
import dashboardReadme from "../../README.md?raw";

describe("P15 stabilization handoff dashboard guidance", () => {
  it("documents final handoff safely without mutation or raw payload rendering", () => {
    const readme = dashboardReadme.replace(/\s+/g, " ");

    expect(readme).toContain("P15-PR-03 is complete");
    expect(readme).toContain("P15-PR-04 is current");
    expect(readme).toContain("P15 closes only after this PR validates");
    expect(readme).toContain(
      "evidence/issue reports/handoff/stabilization docs must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data",
    );
    expect(readme).toContain("no `dangerouslySetInnerHTML`");
  });
});
