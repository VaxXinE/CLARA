import { describe, expect, it } from "vitest";
import { hasPermission } from "../src/auth/permissions";

describe("P19 real role access runtime", () => {
  it("keeps owner and agent CRM mutation policy enabled through backend permissions", () => {
    expect(hasPermission("owner", "customer:create")).toBe(true);
    expect(hasPermission("owner", "customer:update")).toBe(true);
    expect(hasPermission("agent", "customer:create")).toBe(true);
    expect(hasPermission("agent", "customer:update")).toBe(true);
  });

  it("keeps viewer read-only", () => {
    expect(hasPermission("viewer", "conversation:read")).toBe(true);
    expect(hasPermission("viewer", "customer:read")).toBe(true);
    expect(hasPermission("viewer", "customer:create")).toBe(false);
    expect(hasPermission("viewer", "customer:update")).toBe(false);
    expect(hasPermission("viewer", "ai_draft:create")).toBe(false);
    expect(hasPermission("viewer", "reply:send")).toBe(false);
  });
});
