import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("P19 real bootstrap no secret exposure", () => {
  it("bootstrap script reads identifiers but does not print provider secrets", () => {
    const script = readFileSync(
      resolve(process.cwd(), "src/db/scripts/bootstrap-owner.ts"),
      "utf8",
    );

    expect(script).toContain("BOOTSTRAP_OWNER_PROVIDER_SUBJECT");
    expect(script).toContain("BOOTSTRAP_OWNER_EMAIL");
    expect(script).not.toContain("BOOTSTRAP_OWNER_ACCESS_TOKEN");
    expect(script).not.toContain("BOOTSTRAP_OWNER_REFRESH_TOKEN");
    expect(script).not.toContain("authorization:");
    expect(script).not.toContain("raw_provider_payload");
  });
});
