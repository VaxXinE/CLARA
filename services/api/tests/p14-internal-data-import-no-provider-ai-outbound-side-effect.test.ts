import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("P14 internal data import no provider AI outbound side effect", () => {
  it("does not activate providers, AI, or outbound send", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/customers/internal-data-import-policy.ts"),
      "utf8",
    );

    expect(source).not.toMatch(/OpenAI|Anthropic|GmailApi|WhatsAppApi/);
    expect(source).not.toMatch(/autoSend|sendExternal|sendNotification/);
  });
});
