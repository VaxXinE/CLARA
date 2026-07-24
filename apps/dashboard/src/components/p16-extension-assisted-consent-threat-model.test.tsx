import { describe, expect, it } from "vitest";
import dashboardReadme from "../../README.md?raw";

describe("P16 extension-assisted consent and threat model dashboard guidance", () => {
  it("documents consent and redaction without raw rendering", () => {
    const readme = dashboardReadme.replace(/\s+/g, " ");

    expect(readme).toContain(
      "extension-assisted ingestion requires operator awareness/consent",
    );
    expect(readme).toContain(
      "evidence/logs/docs/runbooks must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data",
    );
    expect(readme).toContain("Security policy");
  });
});
