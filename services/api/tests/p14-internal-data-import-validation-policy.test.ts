import { describe, expect, it } from "vitest";
import { buildAuthContext } from "../src/auth/auth-context";
import { validateInternalCustomerImport } from "../src/customers/internal-data-import-policy";

function auth() {
  return buildAuthContext({
    userId: "usr_demo_owner",
    organizationId: "org_demo",
    workspaceId: "wks_demo_sales",
    role: "owner",
  });
}

describe("P14 internal data import validation policy", () => {
  it("rejects unknown fields", () => {
    expect(() =>
      validateInternalCustomerImport(auth(), {
        displayName: "Internal Customer",
        unknownField: "not allowed",
      }),
    ).toThrow("Unknown import field.");
  });

  it("rejects secret-like fields", () => {
    for (const field of [
      "accessToken",
      "refreshToken",
      "clientSecret",
      "authorizationHeader",
      "cookie",
      "apiKey",
      "paymentCard",
    ]) {
      expect(() =>
        validateInternalCustomerImport(auth(), {
          displayName: "Internal Customer",
          [field]: "x",
        }),
      ).toThrow("Unsafe import field.");
    }
  });

  it("rejects raw provider, webhook, DOM, HTML, and prompt fields", () => {
    for (const field of [
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawDom",
      "rawHtml",
      "rawPrompt",
    ]) {
      expect(() =>
        validateInternalCustomerImport(auth(), {
          displayName: "Internal Customer",
          [field]: "<raw>",
        }),
      ).toThrow("Unsafe import field.");
    }
  });
});
