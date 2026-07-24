import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("P17 real AI analysis side-effect boundary", () => {
  it("does not activate billing, payment, or outbound auto-send", () => {
    const service = readFileSync(
      join(process.cwd(), "src/ai/extension-snapshot-ai-analysis-service.ts"),
      "utf8",
    );

    expect(service).not.toMatch(/checkout|invoice|chargeCustomer/);
    expect(service).not.toMatch(/sendReply|autoSend|outboundSend/);
  });
});
