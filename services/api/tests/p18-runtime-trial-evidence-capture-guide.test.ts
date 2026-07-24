import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const text = readFileSync(
  resolve(
    root,
    "docs/product/CLARA-P18-RUNTIME-TRIAL-EVIDENCE-CAPTURE-GUIDE.md",
  ),
  "utf8",
);

describe("P18 runtime trial evidence capture guide", () => {
  it("keeps evidence privacy-safe and server-authoritative", () => {
    expect(text).toMatch(/safe counts/i);
    expect(text).toMatch(/safe status/i);
    expect(text).toContain(
      "Runtime evidence must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/raw customer messages as prompts/payment data",
    );
    expect(text).toContain("AI analysis remains backend/server-side");
    expect(text).toContain("AI provider secrets remain server-only");
    expect(text).toContain("Extension must not call AI providers directly");
    expect(text).toContain(
      "AuthContext and workspace membership remain source of truth",
    );
    expect(text).toContain("Client-supplied workspaceId is not authoritative");
  });
});
