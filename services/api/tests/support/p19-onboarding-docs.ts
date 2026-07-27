import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect } from "vitest";

export function readP19Doc(file: string): string {
  return readFileSync(resolve(process.cwd(), "../../docs/product", file), "utf8");
}

export function expectP19Safety(text: string): void {
  expect(text).toContain("internal team usage must use provider auth");
  expect(text).toContain("Mock/demo mode is dev/test only");
  expect(text).toContain("Backend AuthContext/workspace membership is source of truth");
  expect(text).toContain("client-supplied workspaceId is not authoritative");
  expect(text).toContain("Missing/inactive membership fails closed");
  expect(text).toContain("CLARA is not public GA launch");
  expect(text).toContain("CLARA is not public SaaS launch");
  expect(text).toContain("Billing/payment remains deferred");
  expect(text).toContain("Official WA/IG/TikTok APIs remain not activated");
  expect(text).toContain("Outbound auto-send remains disabled");
  expect(text).not.toMatch(/public GA launch is complete/i);
  expect(text).not.toMatch(/billing\/payment is activated/i);
  expect(text).not.toMatch(/outbound auto-send enabled/i);
}
