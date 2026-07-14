import designSystemContract from "../../../../docs/product/CLARA-P51-DESIGN-SYSTEM-CONTRACT.md?raw";
import routeMigrationMap from "../../../../docs/product/CLARA-P51-ROUTE-MIGRATION-MAP.md?raw";
import securityRules from "../../../../docs/product/CLARA-P51-UI-MIGRATION-SECURITY-RULES.md?raw";
import { describe, expect, it } from "vitest";

const includesAll = (content: string, terms: string[]) => {
  const lowerContent = content.toLowerCase();

  for (const term of terms) {
    expect(lowerContent).toContain(term.toLowerCase());
  }
};

describe("P5.1 design system contract docs", () => {
  it("keeps the legacy shell contract explicit", () => {
    includesAll(designSystemContract, [
      "dark workspace shell",
      "gold accent",
      "left sidebar",
      "topbar",
      "grouped navigation",
      "role-aware navigation",
      "backend authorization source of truth",
    ]);
  });

  it("keeps the route migration map complete for legacy dashboard areas", () => {
    includesAll(routeMigrationMap, [
      "sales",
      "crm",
      "customers",
      "follow-up",
      "notifications",
      "approvals",
      "manager-insights",
      "knowledge",
      "kpi",
      "admin/access",
    ]);
  });

  it("keeps UI migration security rules explicit", () => {
    includesAll(securityRules, [
      "dangerouslysetinnerhtml",
      "frontend service role key",
      "raw provider payload",
      "provider cookie/token",
      "openai api key in frontend",
      "explicit human send action",
      "backend authorization is the source of truth",
    ]);
  });
});
