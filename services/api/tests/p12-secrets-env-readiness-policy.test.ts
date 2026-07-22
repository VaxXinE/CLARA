import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const doc = readFileSync(
  new URL(
    "../../../docs/product/CLARA-P12-SECRETS-ENV-READINESS-CHECKLIST.md",
    import.meta.url,
  ),
  "utf8",
);

describe("P12 secrets/env readiness policy", () => {
  it("requires platform-owned secrets and no committed env files", () => {
    expect(doc).toContain(
      "No `.env`, `.env.local`, or `.env.production` file is committed",
    );
    expect(doc).toContain(
      "Secrets/environment variables are supplied by platform config or a secret manager",
    );
    expect(doc).toContain(
      "Config evidence records only presence/status, never secret values",
    );
  });
});
