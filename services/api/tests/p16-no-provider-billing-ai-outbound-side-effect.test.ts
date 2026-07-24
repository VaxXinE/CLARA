import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");
const docs = [
  "docs/product/CLARA-P16-EXTENSION-ASSISTED-CHANNEL-SCOPE.md",
  "docs/product/CLARA-P16-EXTENSION-ASSISTED-DISALLOWED-CAPTURE-POLICY.md",
  "docs/product/CLARA-P16-OFFICIAL-PROVIDER-API-NON-ACTIVATION-POLICY.md",
  "docs/product/CLARA-P16-P17-COMPRESSED-ROADMAP.md",
].map((path) => readFileSync(resolve(root, path), "utf8").replace(/\s+/g, " "));

describe("P16 side-effect guardrails", () => {
  it("keeps provider APIs, billing, real AI, outbound, notifications, jobs, and raw payloads inactive", () => {
    const bundle = docs.join(" ");

    expect(bundle).toContain("billing/payment is deferred");
    expect(bundle).toContain("official WA/IG/TikTok APIs remain not activated");
    expect(bundle).toContain(
      "real AI provider calls remain not activated in this PR",
    );
    expect(bundle).toContain("no outbound auto-send is activated");
    expect(bundle).toContain(
      "no external support tool integration is activated",
    );
    expect(bundle).toContain(
      "evidence/logs/docs/runbooks must not include secrets/tokens/cookies/auth headers/raw provider payload/raw webhook payload/raw HTML/raw DOM/raw prompts/payment data",
    );
  });
});
