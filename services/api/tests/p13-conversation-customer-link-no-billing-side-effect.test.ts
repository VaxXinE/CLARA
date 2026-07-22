import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

describe("P13 conversation customer link billing boundary", () => {
  it("does not add billing, payment, subscription, or quota side effects", () => {
    const source = readFileSync(
      path.resolve(__dirname, "../src/conversations/conversation-service.ts"),
      "utf8",
    );

    expect(source).not.toMatch(/checkout|invoice|subscription|charge|quota/i);
  });
});
