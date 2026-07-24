import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "src/ai/ai-provider-runtime-config.ts"),
  "utf8",
);

describe("P17 AI no provider billing outbound side effect", () => {
  it("does not activate billing, official channel provider APIs, or outbound send", () => {
    expect(source).not.toMatch(/stripe|checkout|invoice|payment/i);
    expect(source).not.toMatch(
      /officialWhatsApp|officialInstagram|officialTikTok/,
    );
    expect(source).not.toMatch(/autoSend|outboundProviderSend/);
  });
});
