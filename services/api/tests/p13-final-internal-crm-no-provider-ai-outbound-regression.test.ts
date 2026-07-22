import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const runtimeFiles = [
  "services/api/src/customers/customer-service.ts",
  "services/api/src/conversations/conversation-service.ts",
  "services/api/src/analytics/internal-crm-dashboard-analytics-service.ts",
].map((file) => resolve(process.cwd(), "..", "..", file));

describe("P13 final internal CRM provider AI outbound regression", () => {
  it("keeps internal CRM flow free from real provider, AI, and outbound send activation", () => {
    const source = runtimeFiles
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");

    expect(source).not.toMatch(/OpenAI|Anthropic|GmailApi|WhatsAppApi/i);
    expect(source).not.toMatch(/generateDraft|autoSend|sendExternal/i);
    expect(source).not.toMatch(/fetch\(|setTimeout\(|setInterval\(/);
  });
});
