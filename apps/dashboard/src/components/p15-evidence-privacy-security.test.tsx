import { describe, expect, it } from "vitest";
import appSource from "../App.tsx?raw";
import workspaceSource from "./ConversationWorkspace.tsx?raw";
import dashboardReadme from "../../README.md?raw";

describe("P15 evidence privacy dashboard security", () => {
  it("keeps evidence guidance safe and runtime free of raw HTML rendering", () => {
    const readme = dashboardReadme.replace(/\s+/g, " ");
    const source = `${appSource}\n${workspaceSource}`;

    expect(readme).toContain(
      "Evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data",
    );
    expect(readme).toContain(
      "Evidence should minimize customer-sensitive data",
    );
    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toMatch(/access_token|refresh_token|Authorization/);
  });
});
