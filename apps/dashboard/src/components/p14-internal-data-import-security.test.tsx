import { describe, expect, it } from "vitest";
import appSource from "../App.tsx?raw";
import workspaceSource from "./ConversationWorkspace.tsx?raw";

describe("P14 internal data import security UI boundary", () => {
  it("does not add browser-side import mutation or unsafe raw rendering", () => {
    const source = `${appSource}\n${workspaceSource}`;

    expect(source).not.toContain("dangerouslySetInnerHTML");
    expect(source).not.toMatch(/FileReader|drag.*drop|upload.*csv/i);
    expect(source).not.toMatch(/access_token|refresh_token|Authorization/);
    expect(source).not.toMatch(/rawProviderPayload|rawWebhookPayload|rawHtml/);
  });
});
