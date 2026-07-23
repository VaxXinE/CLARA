import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "..", "..");

const requiredDocs = [
  "docs/product/CLARA-P14-INTERNAL-BETA-ROLLOUT-SCOPE.md",
  "docs/product/CLARA-P14-INTERNAL-ENVIRONMENT-PLAN.md",
  "docs/product/CLARA-P14-INTERNAL-USER-ROLE-PLAN.md",
  "docs/product/CLARA-P14-INTERNAL-DATA-POLICY.md",
  "docs/product/CLARA-P14-INTERNAL-SECURITY-CHECKLIST.md",
  "docs/product/CLARA-P14-INTERNAL-BETA-ROADMAP.md",
  "docs/product/CLARA-FINAL-ROADMAP.md",
  "docs/product/CLARA-DOCUMENTATION-INDEX.md",
];

const requiredPhrases = [
  "internal use first",
  "billing deferred",
  "public launch deferred",
  "production deployment requires separate explicit action",
  "Provider/AI/outbound activation remains controlled",
  "internal user roles are defined",
  "internal data policy exists",
  "security checklist exists",
  "P13 Internal CRM Product Activation is complete",
  "P14-PR-01",
];

function readRepoFile(path: string) {
  return readFileSync(resolve(root, path), "utf8");
}

describe("P14 internal beta rollout environment plan", () => {
  it("keeps the required internal beta rollout docs present and meaningful", () => {
    for (const doc of requiredDocs) {
      const absolutePath = resolve(root, doc);

      expect(existsSync(absolutePath), `${doc} should exist`).toBe(true);
      expect(readFileSync(absolutePath, "utf8").length, doc).toBeGreaterThan(
        300,
      );
    }
  });

  it("keeps internal beta, launch, billing, activation, role, data, and security guardrails explicit", () => {
    const bundle = requiredDocs.map(readRepoFile).join("\n");

    for (const phrase of requiredPhrases) {
      expect(bundle).toContain(phrase);
    }

    expect(bundle).toContain("CLARA is not production deployed yet");
    expect(bundle).toContain("CLARA is not public GA launched yet");
    expect(bundle).toContain("Backend AuthContext");
  });

  it("keeps the P14 validator wired to API, Dashboard, Extension, and the pass banner", () => {
    const validatorPath =
      "scripts/validate-p14-internal-beta-rollout-environment-plan.sh";
    const validator = readRepoFile(validatorPath);

    expect(existsSync(resolve(root, validatorPath))).toBe(true);
    expect(validator).toContain("services/api");
    expect(validator).toContain("apps/dashboard");
    expect(validator).toContain("apps/extension");
    expect(validator).toContain("npm run typecheck");
    expect(validator).toContain("npm run test");
    expect(validator).toContain("npm run build");
    expect(validator).toContain("npm audit --omit=dev --audit-level=high");
    expect(validator).toContain("CLARA P14-PR-01 VALIDATION PASSED");
  });
});
