import appSource from "../App.tsx?raw";
import { describe, expect, it } from "vitest";

describe("P12 final GA dashboard UI regression", () => {
  it("keeps readiness UI free of secret and raw payload display fields", () => {
    for (const pattern of [
      "access_token",
      "refresh_token",
      "Authorization",
      "client_secret",
      "rawProviderPayload",
      "rawWebhookPayload",
      "rawHtml",
    ]) {
      expect(appSource).not.toContain(pattern);
    }
  });
});
