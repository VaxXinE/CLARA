import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const runtimeFiles = [
  "services/api/src/auth/owner-bootstrap-service.ts",
  "services/api/src/auth/user-role-management-service.ts",
  "services/api/src/auth/workspace-membership-service.ts",
  "services/api/src/http/routes/user-role-management.ts",
];

describe("P14 internal user bootstrap no provider AI outbound side effect", () => {
  it("does not activate provider, AI, outbound send, deployment, queue, or raw payload rendering", () => {
    const source = runtimeFiles
      .map((file) =>
        readFileSync(resolve(process.cwd(), "..", "..", file), "utf8"),
      )
      .join("\n");

    expect(source).not.toMatch(/OpenAI|Anthropic|GmailApi|WhatsAppApi/);
    expect(source).not.toMatch(/autoSend|sendExternal|sendNotification/);
    expect(source).not.toMatch(/deployProduction|rollbackProduction/);
    expect(source).not.toMatch(/queue\.add|cron|worker/);
    expect(source).not.toMatch(/dangerouslySetInnerHTML|rawHtml/);
    expect(source).not.toMatch(/raw_provider_payload|raw_webhook_payload/);
  });
});
