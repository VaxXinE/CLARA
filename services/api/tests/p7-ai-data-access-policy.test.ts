import { describe, expect, it } from "vitest";
import {
  canAiAccessDataCategory,
  isAiDataCategoryBlocked,
  sanitizeAiContextMetadata,
} from "../src/ai/ai-data-access-policy";

describe("P7 AI data access policy", () => {
  it("allows minimized task data and blocks secrets/provider internals", () => {
    expect(canAiAccessDataCategory("task_selected_conversation_text")).toBe(
      true,
    );
    expect(canAiAccessDataCategory("safe_channel_status")).toBe(true);
    expect(isAiDataCategoryBlocked("access_token")).toBe(true);
    expect(isAiDataCategoryBlocked("refresh_token")).toBe(true);
    expect(isAiDataCategoryBlocked("raw_provider_payload")).toBe(true);
    expect(isAiDataCategoryBlocked("raw_webhook_body")).toBe(true);
    expect(isAiDataCategoryBlocked("raw_dom")).toBe(true);
    expect(isAiDataCategoryBlocked("raw_html")).toBe(true);
  });

  it("sanitizes AI context metadata with allowlist-only behavior", () => {
    const metadata = sanitizeAiContextMetadata({
      task_selected_conversation_text: "Selected message only",
      customer_display_name: "Ada",
      safe_channel_status: "connected",
      access_token: "atk",
      refresh_token: "rtk",
      cookies: "sid=abc",
      raw_provider_payload: "unsafe",
      raw_webhook_body: "unsafe",
      raw_dom: "<main>unsafe</main>",
      raw_html: "<script>x</script>",
      authorization_header: "Bearer atk",
      cross_workspace_data: "other workspace",
    });
    const serialized = JSON.stringify(metadata);

    expect(metadata).toEqual({
      task_selected_conversation_text: "Selected message only",
      customer_display_name: "Ada",
      safe_channel_status: "connected",
    });
    expect(serialized).not.toContain("atk");
    expect(serialized).not.toContain("rtk");
    expect(serialized).not.toContain("sid=abc");
    expect(serialized).not.toContain("unsafe");
  });
});
