import { describe, expect, it } from "vitest";
import appSource from "../App.tsx?raw";
import workspaceSource from "./ConversationWorkspace.tsx?raw";
import dashboardReadme from "../../README.md?raw";

describe("P14 final internal beta dashboard security", () => {
  it("keeps sensitive handoff data out of UI runtime and docs", () => {
    const readme = dashboardReadme.replace(/\s+/g, " ");
    const source = `${appSource}\n${workspaceSource}`;

    expect(readme).toContain(
      "Secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data must not be included in handoff, feedback, logs, docs, or runbooks",
    );
    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toMatch(/access_token|refresh_token|client_secret/);
  });
});
