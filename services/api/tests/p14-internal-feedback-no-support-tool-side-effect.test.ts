import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

describe("P14 internal feedback no support tool side effect", () => {
  it("keeps the extension and dashboard free of external support submission powers", () => {
    const runtime = [
      "apps/dashboard/src/App.tsx",
      "apps/dashboard/src/components/ConversationWorkspace.tsx",
      "apps/extension/src/api/clara-extension-api-client.ts",
    ]
      .map((file) => readFileSync(resolve(root, file), "utf8"))
      .join("\n");

    expect(runtime).not.toMatch(/zendesk|intercom|freshdesk|jira/i);
    expect(runtime).not.toMatch(/submitFeedback|createTicket|sendFeedback/);
  });
});
