import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("P17 final AI side-effect regression", () => {
  it("does not activate official provider APIs, billing, or outbound auto-send", () => {
    const source = readFileSync(
      join(process.cwd(), "src/ai/extension-snapshot-ai-analysis-service.ts"),
      "utf8",
    );

    expect(source).not.toMatch(/checkout|invoice|chargeCustomer|paymentIntent/);
    expect(source).not.toMatch(/autoSend|sendReply|outboundSend/);
    expect(source).not.toMatch(
      /officialWhatsApp|officialInstagram|officialTikTok/,
    );
  });
});
