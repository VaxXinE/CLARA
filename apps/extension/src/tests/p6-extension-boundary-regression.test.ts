import { describe, expect, it } from "vitest";
import { extensionBackground } from "../background";
import { buildChatGptSafeContext } from "../chatgpt/chatgpt-safe-context-builder";
import type { ExtensionSnapshotPayload } from "../types/extension-snapshot";

const p6ExtensionBoundaryPolicy = [
  "no cookies",
  "no session tokens",
  "no raw DOM",
  "no raw HTML",
  "no background crawling",
  "no auto-send",
  "active visible chat only",
  "user-assisted snapshot only",
  "ChatGPT companion manual only",
].join("\n");

describe("P6 extension boundary regression", () => {
  it("keeps extension bridge user-assisted and active visible chat only", () => {
    expect(extensionBackground).toEqual({
      syncScope: "active_conversation_only",
      sendMode: "manual_assisted",
    });
    expect(p6ExtensionBoundaryPolicy).toContain("active visible chat only");
    expect(p6ExtensionBoundaryPolicy).toContain("user-assisted snapshot only");
  });

  it("documents and preserves blocked extension provider behaviors", () => {
    expect(p6ExtensionBoundaryPolicy).toContain("no cookies");
    expect(p6ExtensionBoundaryPolicy).toContain("no session tokens");
    expect(p6ExtensionBoundaryPolicy).toContain("no raw DOM");
    expect(p6ExtensionBoundaryPolicy).toContain("no raw HTML");
    expect(p6ExtensionBoundaryPolicy).toContain("no background crawling");
    expect(p6ExtensionBoundaryPolicy).toContain("no auto-send");
  });

  it("keeps ChatGPT companion manual-only", () => {
    const snapshot: ExtensionSnapshotPayload = {
      provider: "extension",
      official_api: false,
      channel: "whatsapp",
      captured_at: "2026-07-14T00:00:00.000Z",
      snapshot_hash: "p6_hash",
      chat_title: "Budi",
      messages: [{ id: "m1", direction: "incoming", text: "Need help" }],
    };

    const context = buildChatGptSafeContext(snapshot);

    expect(p6ExtensionBoundaryPolicy).toContain(
      "ChatGPT companion manual only",
    );
    expect(context).toContain("human operator explicitly reviews");
    expect(context).not.toContain("access_token");
    expect(context).not.toContain("refresh_token");
  });
});
