import { accessSync, constants, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const scripts = [
  "../../scripts/validate-production-runtime-config.sh",
  "../../scripts/production-smoke-check.sh",
];

describe("production deployment smoke scripts", () => {
  it("keeps smoke scripts present and executable", () => {
    for (const script of scripts) {
      const path = resolve(script);

      accessSync(path, constants.X_OK);
      expect(statSync(path).isFile()).toBe(true);
    }
  });

  it("does not require committed env files or external provider API calls", () => {
    for (const script of scripts) {
      const content = readFileSync(resolve(script), "utf8");

      expect(content).not.toContain(".env.production");
      expect(content).not.toContain("googleapis.com");
      expect(content).not.toContain("supabase.co/auth");
      expect(content).not.toContain("curl https://");
      expect(content).not.toContain("service_role");
    }
  });
});
