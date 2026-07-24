import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const routeSource = readFileSync(
  join(process.cwd(), "src/http/routes/extension.ts"),
  "utf8",
);
const validationSource = readFileSync(
  join(process.cwd(), "src/extension/extension-snapshot-validation.ts"),
  "utf8",
);

describe("P16 snapshot redaction side-effect regression", () => {
  it("keeps extension snapshot intake free of provider, billing, AI, and outbound side effects", () => {
    const source = `${routeSource}\n${validationSource}`;

    expect(source).not.toContain("official_api: true");
    expect(source).not.toContain("generateAiDraft");
    expect(source).not.toContain("sendReply");
    expect(source).not.toContain("checkout");
    expect(source).not.toContain("invoice");
  });
});
