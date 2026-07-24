import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("P17 real AI analysis official channel non-activation", () => {
  it("does not activate official WA/IG/TikTok APIs from AI analysis", () => {
    const source = readFileSync(
      join(process.cwd(), "src/ai/extension-snapshot-ai-analysis-service.ts"),
      "utf8",
    );

    expect(source).not.toMatch(
      /graph\.facebook|business\.tiktok|whatsapp_business/,
    );
  });
});
