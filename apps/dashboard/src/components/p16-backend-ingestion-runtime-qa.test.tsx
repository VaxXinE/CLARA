import { describe, expect, it } from "vitest";
import appSource from "../App.tsx?raw";

describe("P16 backend ingestion runtime QA dashboard guidance", () => {
  it("keeps dashboard visibility read-only and free of raw snapshot rendering", () => {
    expect(appSource).toContain("Conversation workspace");
    expect(appSource).not.toContain("dangerouslySetInnerHTML");
    expect(appSource).not.toContain("raw_provider_payload");
    expect(appSource).not.toContain("raw_webhook_payload");
    expect(appSource).not.toContain("raw_html");
    expect(appSource).not.toContain("raw_dom");
  });
});
