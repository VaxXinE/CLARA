import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("P17 AI context no provider billing outbound side effect", () => {
  it("does not add outbound sends, billing charge, or official social provider activation", () => {
    const source = readFileSync(
      join(process.cwd(), "src/ai/extension-snapshot-ai-context-builder.ts"),
      "utf8",
    );

    expect(source).not.toContain("autoSend");
    expect(source).not.toContain("chargeCustomer");
    expect(source).not.toContain("officialWhatsApp");
  });
});
