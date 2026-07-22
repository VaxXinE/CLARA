import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

describe("P13 conversation customer link provider and AI boundary", () => {
  it("does not call providers, generate AI, or auto-send outbound messages", () => {
    const source = readFileSync(
      path.resolve(__dirname, "../src/conversations/conversation-service.ts"),
      "utf8",
    );

    expect(source).not.toMatch(/gmail|whatsapp|openai|anthropic|autosend/i);
  });
});
